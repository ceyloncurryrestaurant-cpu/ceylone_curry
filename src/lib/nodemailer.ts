import nodemailer from "nodemailer";

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

// Nodemailer Transporter configuration
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "mahendranpradhikshalini@gmail.com";
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "rkezrecuoxeoljjy";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function sendReservationEmails(data: ReservationEmailData) {
  const smtpUser = process.env.SMTP_USER || "mahendranpradhikshalini@gmail.com";
  const adminEmail = data.adminEmail || process.env.ADMIN_EMAIL || smtpUser;

  // 1. Customer HTML Email Template (Clean & Balanced Color Palette)
  const customerHtmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 24px; border: 2px solid #071B5C; color: #071B5C;">
      <div style="background: #071B5C; text-align: center; padding: 24px; border-radius: 18px; margin-bottom: 20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">CEYLON <span style="color: #F5B91A;">CURRY</span></h1>
        <p style="color: #F5B91A; font-weight: 800; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">Authentic Sri Lankan Cuisine</p>
      </div>

      <div style="padding: 10px 10px 20px 10px;">
        <h2 style="color: #071B5C; margin-top: 0; font-size: 22px; font-weight: 800;">Table Reservation Confirmed!</h2>
        <p style="color: #334155; line-height: 1.6; font-size: 14px;">Dear <strong>${data.customerName}</strong>,</p>
        <p style="color: #334155; line-height: 1.6; font-size: 14px;">Thank you for reserving a table at Ceylon Curry. We are delighted to confirm your booking!</p>

        <div style="background: #071B5C; padding: 20px; border-radius: 16px; border: 2px solid #F5B91A; margin: 20px 0; color: #ffffff;">
          <h3 style="color: #F5B91A; margin-top: 0; border-bottom: 1px solid rgba(245,185,26,0.3); padding-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Reservation Ref:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #F5B91A;">${data.reservationNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Date:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Arrival Time:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Table Assigned:</td>
              <td style="padding: 8px 0; color: #ffffff;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Location:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"}</td>
            </tr>
            ${
              data.specialRequest
                ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #93c5fd;">Special Request:</td><td style="padding: 8px 0; font-style: italic; color: #ffffff;">${data.specialRequest}</td></tr>`
                : ""
            }
          </table>
        </div>

        <p style="color: #475569; font-size: 13px; line-height: 1.5;">Need to amend or cancel your booking? Please call us at <strong style="color: #071B5C;">${data.restaurantPhone || "01752 941504"}</strong> or email <strong style="color: #071B5C;">${data.restaurantEmail || "info@ceyloncurry.co.uk"}</strong>.</p>
      </div>

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">Ceylon Curry • ${data.restaurantAddress || "44 Mayflower St, Plymouth PL1 1QX"} • ${data.restaurantPhone || "01752 941504"}</p>
      </div>
    </div>
  `;

  // 2. Admin Notification Email Template (Clean & Balanced Color Palette)
  const adminHtmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 24px; border: 2px solid #071B5C; color: #071B5C;">
      <div style="background: #071B5C; text-align: center; padding: 20px; border-radius: 18px; margin-bottom: 20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">NEW RESERVATION ALERT 🔔</h1>
        <p style="color: #F5B91A; font-weight: 800; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Ceylon Curry Admin Notification</p>
      </div>

      <div style="padding: 10px;">
        <h2 style="color: #071B5C; margin-top: 0; font-size: 20px;">New Booking Received</h2>
        <p style="color: #334155; line-height: 1.6; font-size: 14px;">A new table reservation has been placed by <strong>${data.customerName}</strong>.</p>

        <div style="background: #071B5C; padding: 20px; border-radius: 16px; border: 2px solid #F5B91A; margin: 20px 0; color: #ffffff;">
          <h3 style="color: #F5B91A; margin-top: 0; border-bottom: 1px solid rgba(245,185,26,0.3); padding-bottom: 10px; font-size: 15px;">Booking Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #ffffff;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Ref Number:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #F5B91A;">${data.reservationNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Customer Name:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Email:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Phone:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Date & Time:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.date} at ${data.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Table Assigned:</td>
              <td style="padding: 6px 0; color: #ffffff;">Table ${data.tableNumber} (${data.tableType}, ${data.guestCount} Guests)</td>
            </tr>
            ${
              data.specialRequest
                ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #93c5fd;">Special Request:</td><td style="padding: 6px 0; font-style: italic; color: #ffffff;">${data.specialRequest}</td></tr>`
                : ""
            }
          </table>
        </div>
      </div>
    </div>
  `;

  try {
    const transporter = getTransporter();
    const tasks = [];

    // Dispatch Email to Customer
    if (data.email) {
      tasks.push(
        transporter.sendMail({
          from: `"Ceylon Curry" <${smtpUser}>`,
          to: data.email,
          subject: `Reservation Confirmed - Ref: ${data.reservationNumber} | Ceylon Curry`,
          html: customerHtmlBody,
        })
      );
    }

    // Dispatch Alert Email to Admin
    if (adminEmail && adminEmail !== data.email) {
      tasks.push(
        transporter.sendMail({
          from: `"Ceylon Curry" <${smtpUser}>`,
          to: adminEmail,
          subject: `🔔 NEW RESERVATION ALERT: ${data.reservationNumber} - ${data.customerName} (${data.date})`,
          html: adminHtmlBody,
        })
      );
    }

    await Promise.all(tasks);
    console.log(`✅ Nodemailer emails dispatched successfully!`);
    return true;
  } catch (error: any) {
    console.error("❌ Nodemailer email dispatch failed:", error.message);
    return false;
  }
}

export const sendReservationConfirmationEmail = sendReservationEmails;
