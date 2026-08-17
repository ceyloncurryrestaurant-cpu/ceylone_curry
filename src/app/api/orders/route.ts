import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Settings from "@/models/Settings";
import { generateWhatsAppOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
    }
    const orders = await Order.find().sort({ createdAt: -1 }).catch(() => []);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support both field naming conventions from the checkout form
    const customerName = body.customerName || body.name || "";
    const email = body.customerEmail || body.email || "";
    const mobile = body.customerPhone || body.mobile || "";
    const address = body.deliveryAddress || body.address || "";
    const notes = body.orderNotes || body.notes || "";
    const items: any[] = body.items || [];

    // 1. Mandatory Checkout Validation
    if (!customerName || !mobile || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please complete all checkout fields and ensure cart is not empty." },
        { status: 400 }
      );
    }

    // 2. Use client-submitted prices directly (no DB revalidation needed when DB is unavailable)
    let validatedItems: any[] = [];
    let subtotal = 0;
    let discount = 0;

    const conn = await connectToDatabase();

    for (const item of items) {
      let actualUnitPrice = parseFloat(item.price) || 0;
      let originalPrice = actualUnitPrice;
      let itemQty = Math.max(1, parseInt(item.quantity) || 1);

      // Try DB revalidation if connected
      if (conn) {
        try {
          const Product = (await import("@/models/Product")).default;
          const productDoc = await Product.findById(item.productId).catch(() => null);
          if (productDoc && productDoc.isAvailable !== false) {
            actualUnitPrice = productDoc.isOffer && productDoc.offerPrice ? productDoc.offerPrice : productDoc.price;
            originalPrice = productDoc.price;
            if (productDoc.isOffer && productDoc.offerPrice) {
              discount += (originalPrice - productDoc.offerPrice) * itemQty;
            }
          }
        } catch (e) {
          // Use client price if DB fails
        }
      }

      const itemSubtotal = actualUnitPrice * itemQty;
      subtotal += originalPrice * itemQty;

      validatedItems.push({
        productId: item.productId || item.id || "",
        name: item.name,
        price: actualUnitPrice,
        quantity: itemQty,
        subtotal: itemSubtotal,
      });
    }

    if (validatedItems.length === 0) {
      // Fallback: use raw items from cart
      validatedItems = items.map((item: any) => ({
        productId: item.productId || item.id || "",
        name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        subtotal: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
      }));
      subtotal = validatedItems.reduce((sum, i) => sum + i.subtotal, 0);
    }

    const total = subtotal - discount;

    // 3. Generate Order Reference Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let orderNumber = `ORD-${dateStr}-001`;

    if (conn) {
      try {
        const count = await Order.countDocuments().catch(() => 0);
        orderNumber = `ORD-${dateStr}-${(count + 1).toString().padStart(3, "0")}`;

        // 4. Save Order in MongoDB
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

        // 5. Fetch WhatsApp Number from Settings
        let settingsDoc = await Settings.findOne().catch(() => null);
        const targetWhatsAppNumber = settingsDoc?.whatsappNumber || memoryStore.settings.whatsappNumber || "+441752941504";

        // 6. Generate WhatsApp Message & Link
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
      } catch (dbErr) {
        console.error("DB order save error, falling back:", dbErr);
      }
    }

    // Fallback path: memoryStore + generate WhatsApp link without DB
    const fallbackCount = memoryStore.orders.length;
    orderNumber = `ORD-${dateStr}-${(fallbackCount + 1).toString().padStart(3, "0")}`;

    const fallbackOrder = {
      _id: `order_${Date.now()}`,
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
      status: "Pending",
      whatsappStatus: "Prepared",
      createdAt: new Date().toISOString(),
    };
    memoryStore.orders.push(fallbackOrder);

    const targetWhatsAppNumber = memoryStore.settings?.whatsappNumber || "+441752941504";

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
      order: fallbackOrder,
      whatsappUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
