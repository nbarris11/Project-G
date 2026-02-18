import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { memberName, homeLocation, budgetPerPerson, availableWeekends, joinPassword } = await req.json();

    if (!memberName || !homeLocation || !budgetPerPerson || !availableWeekends || !joinPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    const valid = await bcrypt.compare(joinPassword, trip.joinPassword);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 403 });
    }

    const response = await prisma.memberResponse.create({
      data: {
        tripId: params.id,
        memberName,
        homeLocation,
        budgetPerPerson: parseFloat(budgetPerPerson),
        availableWeekends: JSON.stringify(availableWeekends),
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
