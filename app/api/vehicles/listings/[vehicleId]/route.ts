import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  vehicleId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { vehicleId } = params;

  if (!vehicleId || typeof vehicleId !== "string") {
    throw new Error("Invalid ID");
  }

  const vehicle = await prisma.vehicle.deleteMany({
    where: {
      id: vehicleId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(vehicle);
}
