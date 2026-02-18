import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { joinCode, joinPassword } = await req.json();

  if (!joinCode || !joinPassword) {
    return NextResponse.json(
      { error: "Trip code and password are required." },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Trip not found. Check your trip code." },
      { status: 404 }
    );
  }

  const valid = await bcrypt.compare(joinPassword, trip.joinPassword);
  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 403 }
    );
  }

  return NextResponse.json({ tripId: trip.id, tripName: trip.name });
}
