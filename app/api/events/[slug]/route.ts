import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          error: "Invalid slug",
        },
        { status: 400 }
      );
    }
    const sanitizedSlug = slug.trim().toLowerCase();

    const event: IEvent | null = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
