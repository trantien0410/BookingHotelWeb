import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: Date;
  endDate?: Date;
  countryValue?: string;
  stateValue?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      countryValue,
      stateValue,
      startDate,
      endDate,
      category,
      minPrice,
      maxPrice,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (countryValue) {
      query.countryValue = countryValue;
    }

    if (stateValue) {
      query.stateValue = stateValue;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = {
        gte: +minPrice,
        lte: +maxPrice,
      };
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: endDate },
                isPaid: true,
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
                isPaid: true,
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      include: {
        images: true,
      },
      orderBy:
        params.minPrice && params.maxPrice
          ? { price: "asc" }
          : { createdAt: "desc" },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      images: listing.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toString(),
      })),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
