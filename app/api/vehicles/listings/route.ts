import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    hyperlink,
    phoneContact,
    images,
    category,
    seatCount,
    detailedAddress,
    latlng,
    countryValue,
    stateValue,
    price,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const vehicleListing = await prisma.vehicle.create({
    data: {
      title,
      description,
      hyperlink: hyperlink ?? null,
      phoneContact,
      category,
      seatCount,
      detailedAddress,
      countryValue: countryValue.value,
      stateValue: stateValue.value,
      latlng,
      price: parseInt(price, 10),
      userId: currentUser.id,
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)],
        },
      },
    },
  });

  return NextResponse.json(vehicleListing);
}
