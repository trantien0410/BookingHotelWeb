import { NextResponse } from "next/server";

import Stripe from "stripe";

import prisma from "@/app/libs/prismadb";
import { stripe } from "@/app/libs/stripe";
import getCurrentUser from "@/app/actions/getCurrentUser";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { vehicleId, startDate, endDate, newTotal } = body;

  if (!vehicleId || !startDate || !endDate || !newTotal) {
    return NextResponse.error();
  }

  const totalPrice = newTotal;

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
    include: {
      images: true,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (vehicle) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: vehicle.title,
          images: vehicle.images.map((image) => image.url),
        },
        unit_amount: Math.round(totalPrice * 100),
      },
    });
  }

  const reservation = await prisma.vehicleReservation.create({
    data: {
      vehicleId,
      userId: currentUser.id,
      startDate,
      endDate,
      totalPrice,
      isPaid: false,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cars/vehicleListings/${vehicleId}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cars/vehicleListings/${vehicleId}?canceled=1`,
    metadata: {
      reservationId: reservation.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
