import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  const trip = await prisma.trip.findUnique({ where: { id: params.id } });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }
  if (trip.ownerId !== userId) {
    return NextResponse.json({ error: "Only the trip organizer can lock in dates." }, { status: 403 });
  }

  const { startDate, endDate, budgetPerPerson } = await req.json();

  if (!startDate || !endDate || !budgetPerPerson) {
    return NextResponse.json({ error: "Start date, end date, and budget are required." }, { status: 400 });
  }

  const updated = await prisma.trip.update({
    where: { id: params.id },
    data: {
      status: "locked",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budgetPerPerson: parseFloat(budgetPerPerson),
    },
  });

  return NextResponse.json(updated);
}
