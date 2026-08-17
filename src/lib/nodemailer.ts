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

// Send email via Resend REST API (works on Vercel — no SMTP port blocking)
async function sendEmailViaResend(
  toEmail: string,
  subject: string,
  htmlContent: string,
  fromName = "Ceylon Curry"
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY not set. Skipping email to:", toEmail);
    return false;
  }

  // Resend requires a verified "from" domain — use onboarding@resend.dev for testing
  // or your own domain once verified at resend.com/domains
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [toEmail],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (res.ok && data.id) {
      console.log(`✅ Resend email sent to ${toEmail} — ID: ${data.id}`);
      return true;
    } else {
      console.error(`❌ Resend error for ${toEmail}:`, JSON.stringify(data));
      return false;
    }
  } catch (err: any) {
    console.error(`❌ Resend fetch error:`, err.message);
    return false;
  }
}

export async function sendReservationEmails(data: ReservationEmailData) {
  const adminEmail = data.adminEmail || process.env.ADMIN_EMAIL || "";

  // 1. Customer Confirmation Email
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #020E66; padding: 30px; border-radius: 20px; border: 2px solid #FFCC00; color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,204,0,0.3);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">CEYLON <span style="color: #FFCC00;">CURRY</span></h1>
        <p style="color: #FFCC00; font-weight: bold; margin-top: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Authentic Sri Lankan Cuisine</p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="color: #FFCC00; margin-top: 0;">Table Reservation Confirmed! ✅</h2>
        <p style="color: #ffffff; line-height: 1.6;">Dear <strong>${data.customerName}</strong>,</p>
        <p style="color: #ffffff; line-height: 1.6;">Thank you for reserving a table at Ceylon Curry. We look forward to welcoming you!</p>

        <div style="background: rgba(6,28,140,0.9); padding: 20px; border-radius: 14px; border: 1.5px solid #FFCC00; margin: 20px 0;">
          <h3 style="color: #FFCC00; margin-top: 0; border-bottom: 1px solid rgba(255,204,0,0.3); padding-bottom: 10px;">📋 Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Reservation Ref:</td><td style="padding: 8px 0; font-weight: bold; color: #FFCC00;">${data.reservationNumber}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td style="padding: 8px 0;">${data.date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Arrival Time:</td><td style="padding: 8px 0;">${data.startTime}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Table:</td><td style="padding: 8px 0;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Location:</td><td style="padding: 8px 0;">${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"}</td></tr>
            ${data.specialRequest ? `<tr><td style="padding: 8px 0; font-weight: bold;">Special Request:</td><td style="padding: 8px 0; font-style: italic;">${data.specialRequest}</td></tr>` : ""}
          </table>
        </div>

        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">Need to amend or cancel? Call <strong>${data.restaurantPhone || "01752 941504"}</strong> or email <strong>${data.restaurantEmail || "info@ceyloncurry.co.uk"}</strong>.</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,204,0,0.3); font-size: 12px; color: #cbd5e1;">
        <p style="margin: 0;">Ceylon Curry &bull; ${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"} &bull; ${data.restaurantPhone || "01752 941504"}</p>
      </div>
    </div>
  `;

  // 2. Admin Alert Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #020E66; padding: 30px; border-radius: 20px; border: 2px solid #FFCC00; color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,204,0,0.3);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 NEW RESERVATION ALERT</h1>
        <p style="color: #FFCC00; font-weight: bold; margin-top: 5px; font-size: 12px; text-transform: uppercase;">Ceylon Curry Admin</p>
      </div>

      <div style="padding: 20px 0;">
        <p style="color: #ffffff; line-height: 1.6;">New table reservation from <strong>${data.customerName}</strong>.</p>
        <div style="background: rgba(6,28,140,0.9); padding: 20px; border-radius: 14px; border: 1.5px solid #FFCC00; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Ref:</td><td style="padding: 6px 0; color: #FFCC00; font-weight: bold;">${data.reservationNumber}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Customer:</td><td style="padding: 6px 0;">${data.customerName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;">${data.email}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${data.mobile}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date &amp; Time:</td><td style="padding: 6px 0;">${data.date} at ${data.startTime}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Table:</td><td style="padding: 6px 0;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td></tr>
            ${data.specialRequest ? `<tr><td style="padding: 6px 0; font-weight: bold;">Special Request:</td><td style="padding: 6px 0; font-style: italic;">${data.specialRequest}</td></tr>` : ""}
          </table>
        </div>
      </div>
    </div>
  `;

  const results = await Promise.allSettled([
    data.email
      ? sendEmailViaResend(data.email, `Reservation Confirmed — ${data.reservationNumber} | Ceylon Curry`, customerHtml)
      : Promise.resolve(false),

    adminEmail && adminEmail !== data.email
      ? sendEmailViaResend(adminEmail, `🔔 NEW RESERVATION: ${data.reservationNumber} — ${data.customerName} (${data.date})`, adminHtml)
      : Promise.resolve(false),
  ]);

  const [cr, ar] = results;
  console.log(`📧 Customer email: ${cr.status === "fulfilled" && cr.value ? "✅ sent" : "❌ failed"}`);
  console.log(`📧 Admin email: ${ar.status === "fulfilled" && ar.value ? "✅ sent" : "❌ failed"}`);
  return true;
}

export const sendReservationConfirmationEmail = sendReservationEmails;
