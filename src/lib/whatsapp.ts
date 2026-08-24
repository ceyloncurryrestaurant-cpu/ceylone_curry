/**
 * Normalizes phone numbers to standard international format (e.g. 01752 941504 -> 441752941504)
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith("0")) {
    cleaned = "44" + cleaned.substring(1);
  }
  return cleaned;
}

export interface OrderMessageData {
  orderNumber: string;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}

/**
 * Constructs the WhatsApp checkout text message according to PRD Requirement #34
 */
export function generateWhatsAppOrderMessage(data: OrderMessageData): string {
  const itemLines = data.items
    .map((item) => `${item.name} x${item.quantity} — £${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const text = `CEYLON CURRY — NEW ORDER (${data.orderNumber})

Customer:
${data.customerName}

Mobile:
${data.mobile}

Email:
${data.email}

Address:
${data.address}

ORDER:
${itemLines}

Subtotal: £${data.subtotal.toFixed(2)}
Discount: £${data.discount.toFixed(2)}
TOTAL: £${data.total.toFixed(2)}${data.total >= 50 ? "\n\n🎁 FREE MAYFLOWER EAST CAR PARK TICKET ELIGIBLE (Spent £50+)" : ""}

Notes:
${data.notes && data.notes.trim() ? data.notes : "None"}

Please confirm my order. Thank you!`;

  return text;
}

/**
 * Builds the direct WhatsApp web/app link
 */
export function getWhatsAppLink(whatsappNumber: string, messageText?: string): string {
  const normalizedNumber = normalizePhoneNumber(whatsappNumber);
  const baseUrl = `https://api.whatsapp.com/send?phone=${normalizedNumber}`;
  if (messageText) {
    return `${baseUrl}&text=${encodeURIComponent(messageText)}`;
  }
  return baseUrl;
}
