import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  restaurantId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { restaurantId } = params;

  if (!restaurantId || typeof restaurantId !== "string") {
    throw new Error("Invalid ID");
  }

  const restaurant = await prisma.restaurant.deleteMany({
    where: {
      id: restaurantId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(restaurant);
}
