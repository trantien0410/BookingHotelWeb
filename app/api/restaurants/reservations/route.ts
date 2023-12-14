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
  const { restaurantId, startDate, endDate, newTotal } = body;

  if (!restaurantId || !startDate || !endDate || !newTotal) {
    return NextResponse.error();
  }

  const totalPrice = newTotal;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      images: true,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (restaurant) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: restaurant.title,
          images: restaurant.images.map((image) => image.url),
        },
        unit_amount: Math.round(totalPrice * 100),
      },
    });
  }

  const reservation = await prisma.restaurantReservation.create({
    data: {
      restaurantId,
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
    success_url: `${process.env.FRONTEND_STORE_URL}/restaurants/restaurantListings/${restaurantId}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/restaurants/restaurantListings/${restaurantId}?canceled=1`,
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
