import prisma from "@/app/libs/prismadb";

export interface IRestaurantListingsParams {
  userId?: string;
  guessCount?: number;
  startDate?: Date;
  endDate?: Date;
  countryValue?: string;
  stateValue?: string;
  restaurantCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default async function getRestaurantListings(
  params: IRestaurantListingsParams
) {
  try {
    const {
      userId,
      guessCount,
      countryValue,
      stateValue,
      startDate,
      endDate,
      restaurantCategory,
      minPrice,
      maxPrice,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (restaurantCategory) {
      query.category = restaurantCategory;
    }

    if (guessCount) {
      query.guessCount = {
        gte: +guessCount,
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

    const restaurants = await prisma.restaurant.findMany({
      where: query,
      include: {
        images: true,
      },
      orderBy:
        params.minPrice && params.maxPrice
          ? { price: "asc" }
          : { createdAt: "desc" },
    });

    const safeRestaurants = restaurants.map((restaurant) => ({
      ...restaurant,
      createdAt: restaurant.createdAt.toISOString(),
      images: restaurant.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toString(),
      })),
    }));

    return safeRestaurants;
  } catch (error: any) {
    throw new Error(error);
  }
}
