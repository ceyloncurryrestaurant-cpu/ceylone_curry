import tls from "tls";

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

// Native Node.js Zero-Dependency TLS SMTP Email Sender with State Machine
function sendNativeSmtpMail(smtpUser: string, smtpPass: string, toEmail: string, subject: string, htmlContent: string): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = (val: boolean) => {
      if (!resolved) {
        resolved = true;
        try { socket.destroy(); } catch (e) {}
        resolve(val);
      }
    };

    // 12-second timeout guard
    const timer = setTimeout(() => {
      console.warn(`⚠️ SMTP delivery timeout for: ${toEmail}`);
      safeResolve(false);
    }, 12000);

    let socket: tls.TLSSocket;

    try {
      socket = tls.connect({ host: "smtp.gmail.com", port: 465 }, () => {});
      socket.setEncoding("utf8");
      let step = 0;

      socket.on("data", (chunk) => {
        const text = chunk.toString();

        if (step === 0 && text.startsWith("220")) {
          step = 1;
          socket.write("EHLO localhost\r\n");
        } else if (step === 1 && (text.includes("250 AUTH") || text.includes("250-AUTH") || text.includes("250 SMTPUTF8"))) {
          step = 2;
          socket.write("AUTH LOGIN\r\n");
        } else if (step === 2 && text.includes("334 VXNlcm5hbWU6")) {
          step = 3;
          socket.write(Buffer.from(smtpUser).toString("base64") + "\r\n");
        } else if (step === 3 && text.includes("334 UGFzc3dvcmQ6")) {
          step = 4;
          socket.write(Buffer.from(smtpPass).toString("base64") + "\r\n");
        } else if (step === 4 && text.startsWith("235")) {
          step = 5;
          socket.write(`MAIL FROM:<${smtpUser}>\r\n`);
        } else if (step === 5 && text.startsWith("250")) {
          step = 6;
          socket.write(`RCPT TO:<${toEmail}>\r\n`);
        } else if (step === 6 && text.startsWith("250")) {
          step = 7;
          socket.write("DATA\r\n");
        } else if (step === 7 && text.startsWith("354")) {
          step = 8;
          const msg = [
            `From: "Ceylon Curry Reservations" <${smtpUser}>`,
            `To: <${toEmail}>`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            ``,
            htmlContent,
            `.`,
            ``
          ].join("\r\n");
          socket.write(msg);
        } else if (step === 8 && text.startsWith("250")) {
          console.log(`✅ Live SMTP Email delivered to: ${toEmail}`);
          clearTimeout(timer);
          socket.write("QUIT\r\n");
          safeResolve(true);
        }
      });

      socket.on("error", (err) => {
        console.warn("Native SMTP Error:", err.message);
        clearTimeout(timer);
        safeResolve(false);
      });
    } catch (e) {
      clearTimeout(timer);
      safeResolve(false);
    }
  });
}

export async function sendReservationEmails(data: ReservationEmailData) {
  const user = process.env.SMTP_USER || "mahendranpradhikshalini@gmail.com";
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "rkezrecuoxeoljjy";
  const adminEmail = data.adminEmail || process.env.ADMIN_EMAIL || "mahendranpradhikshalini@gmail.com";

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
            ${
              data.specialRequest
                ? `<tr><td style="padding: 8px 0; font-weight: bold;">Special Request:</td><td style="padding: 8px 0; font-style: italic;">${data.specialRequest}</td></tr>`
                : ""
            }
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
              <td style="padding: 6px 0; font-weight: bold;">Date & Time:</td>
              <td style="padding: 6px 0;">${data.date} at ${data.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Table Assigned:</td>
              <td style="padding: 6px 0;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td>
            </tr>
            ${
              data.specialRequest
                ? `<tr><td style="padding: 6px 0; font-weight: bold;">Special Request:</td><td style="padding: 6px 0; font-style: italic;">${data.specialRequest}</td></tr>`
                : ""
            }
          </table>
        </div>
      </div>
    </div>
  `;

  const tasks: Promise<boolean>[] = [];

  // Dispatch Email to Customer
  if (data.email) {
    tasks.push(
      sendNativeSmtpMail(
        user,
        pass,
        data.email,
        `Reservation Confirmed - Ref: ${data.reservationNumber} | Ceylon Curry`,
        customerHtmlBody
      )
    );
  }

  // Dispatch Alert Email to Admin
  if (adminEmail && adminEmail !== data.email) {
    tasks.push(
      sendNativeSmtpMail(
        user,
        pass,
        adminEmail,
        `🔔 NEW RESERVATION ALERT: ${data.reservationNumber} - ${data.customerName} (${data.date})`,
        adminHtmlBody
      )
    );
  }

  await Promise.allSettled(tasks);
  return true;
}

export const sendReservationConfirmationEmail = sendReservationEmails;
