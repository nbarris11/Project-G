import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Allow unauthenticated access with join password via query param
  const url = new URL(req.url);
  const joinPassword = url.searchParams.get("joinPassword");

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      selectedCourses: true,
      itinerary: { orderBy: [{ day: "asc" }, { type: "asc" }] },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  const userId = session?.user
    ? (session.user as { id?: string }).id
    : undefined;

  // Owner can always access
  if (userId === trip.ownerId) {
    return NextResponse.json(trip);
  }

  // Otherwise, require the join password
  if (!joinPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await bcrypt.compare(joinPassword, trip.joinPassword);
  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect trip password." },
      { status: 403 }
    );
  }

  return NextResponse.json(trip);
}
