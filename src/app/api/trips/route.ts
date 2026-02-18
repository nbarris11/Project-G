import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/nanoid";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;

  try {
    const body = await req.json();
    const {
      name,
      destination,
      startDate,
      endDate,
      numberOfGolfers,
      budgetPerPerson,
      skillLevel,
      lodgingType,
      notes,
      joinPassword,
    } = body;

    if (
      !name ||
      !destination ||
      !startDate ||
      !endDate ||
      !numberOfGolfers ||
      !budgetPerPerson ||
      !skillLevel ||
      !lodgingType ||
      !joinPassword
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const hashedJoinPassword = await bcrypt.hash(joinPassword, 10);
    const joinCode = nanoid(8).toUpperCase();

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfGolfers: parseInt(numberOfGolfers),
        budgetPerPerson: parseFloat(budgetPerPerson),
        skillLevel,
        lodgingType,
        notes: notes || null,
        joinCode,
        joinPassword: hashedJoinPassword,
        ownerId: userId!,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
