import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import { generateWhatsAppOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerName, email, mobile, address, items, notes } = body;

    // 1. Mandatory Checkout Validation
    if (!customerName || !email || !mobile || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please complete all checkout fields and ensure cart is not empty." },
        { status: 400 }
      );
    }

    // 2. Server-side Price Revalidation (Requirement #103)
    let validatedItems: any[] = [];
    let subtotal = 0;
    let discount = 0;

    for (const item of items) {
      const productDoc = await Product.findById(item.productId);
      if (!productDoc || !productDoc.isAvailable) {
        return NextResponse.json(
          { success: false, error: `Product '${item.name}' is currently unavailable.` },
          { status: 400 }
        );
      }

      // Determine correct price based on offer state
      const actualUnitPrice = productDoc.isOffer && productDoc.offerPrice ? productDoc.offerPrice : productDoc.price;
      const originalPrice = productDoc.price;
      const itemQty = Math.max(1, parseInt(item.quantity) || 1);
      const itemSubtotal = actualUnitPrice * itemQty;

      subtotal += originalPrice * itemQty;
      if (productDoc.isOffer && productDoc.offerPrice) {
        discount += (originalPrice - productDoc.offerPrice) * itemQty;
      }

      validatedItems.push({
        productId: productDoc._id.toString(),
        name: productDoc.name,
        price: actualUnitPrice,
        quantity: itemQty,
        subtotal: itemSubtotal,
      });
    }

    const total = subtotal - discount;

    // 3. Generate Order Reference Number (e.g. ORD-20260817-001)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${dateStr}-${(count + 1).toString().padStart(3, "0")}`;

    // 4. Save Operational Order in MongoDB
    const newOrder = await Order.create({
      orderNumber,
      customerName,
      email,
      mobile,
      address,
      items: validatedItems,
      subtotal,
      discount,
      total,
      notes,
      whatsappStatus: "Prepared",
    });

    // 5. Fetch Dynamic WhatsApp Number from Settings (Requirement #35 & #91)
    let settings = await Settings.findOne();
    const targetWhatsAppNumber = settings?.whatsappNumber || "+441752941504";

    // 6. Generate WhatsApp Checkout Message Text & Deep Link
    const messageText = generateWhatsAppOrderMessage({
      orderNumber,
      customerName,
      mobile,
      email,
      address,
      items: validatedItems,
      subtotal,
      discount,
      total,
      notes,
    });

    const whatsappUrl = getWhatsAppLink(targetWhatsAppNumber, messageText);

    return NextResponse.json({
      success: true,
      message: "Order prepared successfully",
      order: newOrder,
      whatsappUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
