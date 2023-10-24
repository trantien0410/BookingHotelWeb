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
  const { listingId, startDate, endDate, newTotal } = body;

  if (!listingId || !startDate || !endDate || !newTotal) {
    return NextResponse.error();
  }

  const totalPrice = newTotal;

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (listing) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: listing.title,
        },
        unit_amount: Math.round(totalPrice * 100),
      },
    });
  }

  const reservation = await prisma.reservation.create({
    data: {
      listingId,
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
    success_url: `${process.env.FRONTEND_STORE_URL}/listings/${listingId}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/listings/${listingId}?canceled=1`,
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
