import prisma from "@/app/libs/prismadb";

export interface IVehicleListingsParams {
  userId?: string;
  seatCount?: number;
  startDate?: Date;
  endDate?: Date;
  countryValue?: string;
  stateValue?: string;
  carCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default async function getVehicleListings(
  params: IVehicleListingsParams
) {
  try {
    const {
      userId,
      seatCount,
      countryValue,
      stateValue,
      startDate,
      endDate,
      carCategory,
      minPrice,
      maxPrice,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (carCategory) {
      query.category = carCategory;
    }

    if (seatCount) {
      query.seatCount = {
        gte: +seatCount,
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

    const vehicles = await prisma.vehicle.findMany({
      where: query,
      include: {
        images: true,
      },
      orderBy:
        params.minPrice && params.maxPrice
          ? { price: "asc" }
          : { createdAt: "desc" },
    });

    const safeVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      createdAt: vehicle.createdAt.toISOString(),
      images: vehicle.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toString(),
      })),
    }));

    return safeVehicles;
  } catch (error: any) {
    throw new Error(error);
  }
}
