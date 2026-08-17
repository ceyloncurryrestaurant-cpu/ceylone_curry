import tls from "tls";
import net from "net";

interface ReservationEmailData {
  reservationNumber: string;
  customerName: string;
  email: string;
  mobile: string;
  tableNumber: number;
  tableType: string;
  guestCount: number;
  date: string;
  startTime: string;
  specialRequest?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  adminEmail?: string;
}

// Robust SMTP email sender using STARTTLS on port 587 (Gmail standard)
function sendSmtpMail(
  smtpUser: string,
  smtpPass: string,
  smtpHost: string,
  smtpPort: number,
  toEmail: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;
    let buffer = "";
    let tlsSocket: tls.TLSSocket | null = null;
    let plainSocket: net.Socket | null = null;
    let step = 0;

    const TIMEOUT_MS = 25000; // 25 seconds for Vercel cold starts

    const safeResolve = (val: boolean, reason?: string) => {
      if (!resolved) {
        resolved = true;
        if (reason) console.log(`📧 SMTP ${val ? "✅" : "❌"} [${toEmail}]: ${reason}`);
        try { tlsSocket?.destroy(); } catch (_) {}
        try { plainSocket?.destroy(); } catch (_) {}
        resolve(val);
      }
    };

    const timer = setTimeout(() => {
      safeResolve(false, `Timeout after ${TIMEOUT_MS}ms at step ${step}`);
    }, TIMEOUT_MS);

    // Send a line over the active socket
    const send = (line: string) => {
      const sock = tlsSocket || plainSocket;
      if (sock && !sock.destroyed) {
        sock.write(line + "\r\n");
      }
    };

    // Process buffered SMTP response lines
    const processLine = (line: string) => {
      const code = line.substring(0, 3);
      const isLast = line[3] === " "; // 250 ... vs 250-...

      console.log(`SMTP [step=${step}] ← ${line}`);

      if (step === 0 && code === "220") {
        step = 1;
        send(`EHLO localhost`);

      } else if (step === 1 && code === "250" && isLast) {
        // EHLO complete - all capability lines received
        step = 2;
        // Use STARTTLS if on port 587
        if (smtpPort === 587) {
          send("STARTTLS");
        } else {
          // Already on TLS (port 465), go straight to AUTH
          step = 3;
          send("AUTH LOGIN");
        }

      } else if (step === 2 && code === "220") {
        // STARTTLS accepted - upgrade the plain socket to TLS
        step = 3;
        if (plainSocket) {
          tlsSocket = tls.connect({
            socket: plainSocket,
            host: smtpHost,
            servername: smtpHost,
          });
          tlsSocket.setEncoding("utf8");
          tlsSocket.on("data", onData);
          tlsSocket.on("error", (err) => safeResolve(false, `TLS error: ${err.message}`));
          tlsSocket.on("secureConnect", () => {
            send(`EHLO localhost`);
            step = 3.5; // Re-EHLO after TLS upgrade
          });
        }

      } else if (step === 3.5 && code === "250" && isLast) {
        // Re-EHLO after TLS complete
        step = 4;
        send("AUTH LOGIN");

      } else if (step === 3 && code === "334") {
        // Username prompt (base64 "Username:")
        step = 4;
        send(Buffer.from(smtpUser).toString("base64"));

      } else if (step === 4 && code === "334") {
        // Password prompt (base64 "Password:")
        step = 5;
        send(Buffer.from(smtpPass).toString("base64"));

      } else if ((step === 4 || step === 5) && code === "235") {
        // AUTH successful
        step = 6;
        send(`MAIL FROM:<${smtpUser}>`);

      } else if (step === 6 && code === "250") {
        step = 7;
        send(`RCPT TO:<${toEmail}>`);

      } else if (step === 7 && code === "250") {
        step = 8;
        send("DATA");

      } else if (step === 8 && code === "354") {
        step = 9;
        const safeSubject = subject.replace(/[\r\n]/g, " ");
        const msg = [
          `From: "Ceylon Curry" <${smtpUser}>`,
          `To: <${toEmail}>`,
          `Subject: ${safeSubject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          htmlContent,
          `.`,
          ``
        ].join("\r\n");
        const sock = tlsSocket || plainSocket;
        if (sock && !sock.destroyed) sock.write(msg);

      } else if (step === 9 && code === "250") {
        clearTimeout(timer);
        send("QUIT");
        safeResolve(true, `Delivered to ${toEmail}`);

      } else if (["421", "450", "451", "452", "500", "501", "502", "503", "535", "550", "551", "552", "553", "554"].includes(code)) {
        clearTimeout(timer);
        safeResolve(false, `SMTP error ${code}: ${line}`);
      }
    };

    const onData = (chunk: string) => {
      buffer += chunk;
      // Process complete lines (CR LF terminated)
      let idx: number;
      while ((idx = buffer.indexOf("\r\n")) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        if (line.trim()) processLine(line);
      }
    };

    try {
      if (smtpPort === 465) {
        // Direct TLS connection
        tlsSocket = tls.connect({ host: smtpHost, port: 465 }, () => {});
        tlsSocket.setEncoding("utf8");
        tlsSocket.on("data", onData);
        tlsSocket.on("error", (err) => safeResolve(false, `TLS socket error: ${err.message}`));
      } else {
        // Plain connection + STARTTLS upgrade
        plainSocket = net.connect({ host: smtpHost, port: smtpPort }, () => {});
        plainSocket.setEncoding("utf8");
        plainSocket.on("data", onData);
        plainSocket.on("error", (err) => safeResolve(false, `Plain socket error: ${err.message}`));
      }
    } catch (e: any) {
      clearTimeout(timer);
      safeResolve(false, `Socket creation error: ${e.message}`);
    }
  });
}

export async function sendReservationEmails(data: ReservationEmailData) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";
  const adminEmail = data.adminEmail || process.env.ADMIN_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass) {
    console.warn("⚠️ SMTP credentials not configured. Skipping email.");
    return false;
  }

  // 1. Customer HTML Email Template
  const customerHtmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #020E66; padding: 30px; border-radius: 20px; border: 2px solid #FFCC00; color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,204,0,0.3);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">CEYLON <span style="color: #FFCC00;">CURRY</span></h1>
        <p style="color: #FFCC00; font-weight: bold; margin-top: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Authentic Sri Lankan Cuisine</p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="color: #FFCC00; margin-top: 0;">Table Reservation Confirmed!</h2>
        <p style="color: #ffffff; line-height: 1.6;">Dear <strong>${data.customerName}</strong>,</p>
        <p style="color: #ffffff; line-height: 1.6;">Thank you for reserving a table at Ceylon Curry. We look forward to welcoming you!</p>

        <div style="background: rgba(6,28,140,0.9); padding: 20px; border-radius: 14px; border: 1.5px solid #FFCC00; margin: 20px 0;">
          <h3 style="color: #FFCC00; margin-top: 0; border-bottom: 1px solid rgba(255,204,0,0.3); padding-bottom: 10px;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Reservation Ref:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #FFCC00;">${data.reservationNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Arrival Time:</td>
              <td style="padding: 8px 0;">${data.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Table Assigned:</td>
              <td style="padding: 8px 0;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0;">${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"}</td>
            </tr>
            ${data.specialRequest ? `<tr><td style="padding: 8px 0; font-weight: bold;">Special Request:</td><td style="padding: 8px 0; font-style: italic;">${data.specialRequest}</td></tr>` : ""}
          </table>
        </div>

        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">Need to amend or cancel your booking? Please call us at <strong>${data.restaurantPhone || "01752 941504"}</strong> or email <strong>${data.restaurantEmail || "info@ceyloncurry.co.uk"}</strong>.</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,204,0,0.3); font-size: 12px; color: #cbd5e1;">
        <p style="margin: 0;">Ceylon Curry • ${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"} • ${data.restaurantPhone || "01752 941504"}</p>
      </div>
    </div>
  `;

  // 2. Admin Notification Email Template
  const adminHtmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #020E66; padding: 30px; border-radius: 20px; border: 2px solid #FFCC00; color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,204,0,0.3);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">NEW RESERVATION ALERT 🔔</h1>
        <p style="color: #FFCC00; font-weight: bold; margin-top: 5px; font-size: 12px; text-transform: uppercase;">Ceylon Curry Admin Notification</p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="color: #FFCC00; margin-top: 0;">New Booking Received</h2>
        <p style="color: #ffffff; line-height: 1.6;">A new table reservation has been placed by <strong>${data.customerName}</strong>.</p>

        <div style="background: rgba(6,28,140,0.9); padding: 20px; border-radius: 14px; border: 1.5px solid #FFCC00; margin: 20px 0;">
          <h3 style="color: #FFCC00; margin-top: 0; border-bottom: 1px solid rgba(255,204,0,0.3); padding-bottom: 10px;">Booking Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Ref Number:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #FFCC00;">${data.reservationNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Customer Name:</td>
              <td style="padding: 6px 0;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 6px 0;">${data.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Date &amp; Time:</td>
              <td style="padding: 6px 0;">${data.date} at ${data.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Table Assigned:</td>
              <td style="padding: 6px 0;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td>
            </tr>
            ${data.specialRequest ? `<tr><td style="padding: 6px 0; font-weight: bold;">Special Request:</td><td style="padding: 6px 0; font-style: italic;">${data.specialRequest}</td></tr>` : ""}
          </table>
        </div>
      </div>
    </div>
  `;

  const results = await Promise.allSettled([
    // Customer confirmation email
    data.email
      ? sendSmtpMail(smtpUser, smtpPass, smtpHost, smtpPort, data.email,
          `Reservation Confirmed - Ref: ${data.reservationNumber} | Ceylon Curry`,
          customerHtmlBody)
      : Promise.resolve(false),

    // Admin notification email (skip if same as customer)
    adminEmail && adminEmail !== data.email
      ? sendSmtpMail(smtpUser, smtpPass, smtpHost, smtpPort, adminEmail,
          `🔔 NEW RESERVATION: ${data.reservationNumber} - ${data.customerName} (${data.date})`,
          adminHtmlBody)
      : Promise.resolve(false),
  ]);

  const [customerResult, adminResult] = results;
  console.log(`📧 Customer email: ${customerResult.status === "fulfilled" && customerResult.value ? "✅ sent" : "❌ failed"}`);
  console.log(`📧 Admin email: ${adminResult.status === "fulfilled" && adminResult.value ? "✅ sent" : "❌ failed"}`);

  return true;
}

export const sendReservationConfirmationEmail = sendReservationEmails;
