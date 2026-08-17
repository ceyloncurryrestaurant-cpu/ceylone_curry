import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

const SEED_REVIEWS = [
  {
    name: "Sarah & Mark Jenkins",
    rating: 5,
    comment: "The Cheese Kottu Roti is unbelievable — exactly like what we had in Colombo! The atmosphere on Mayflower Street feels so warm and upscale.",
    favoriteDish: "Cheese Kottu Roti",
    isApproved: true,
  },
  {
    name: "David C.",
    rating: 5,
    comment: "Hands down the best Sri Lankan black lamb curry in the South West. Deep, dark roasted spices, tender lamb, and impeccable hospitality.",
    favoriteDish: "Jaffna Black Lamb Curry",
    isApproved: true,
  },
  {
    name: "Priyantha Wickramasinghe",
    rating: 5,
    comment: "Authentic Karapincha and true Ceylon cinnamon notes in every dish. Exceptional table service and visual table reservation workflow!",
    favoriteDish: "Devilled King Prawns",
    isApproved: true,
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      await Review.insertMany(SEED_REVIEWS);
      reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, rating, comment, favoriteDish } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Name, rating, and comment are required." },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      name,
      rating: Number(rating),
      comment,
      favoriteDish: favoriteDish || "",
      isApproved: true,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post review" },
      { status: 500 }
    );
  }
}
