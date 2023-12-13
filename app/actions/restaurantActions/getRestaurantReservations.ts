import prisma from "@/app/libs/prismadb";

interface IParams {
  restaurantId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getRestaurantReservations(params: IParams) {
  try {
    const { restaurantId, userId, authorId } = params;

    const query: any = { isPaid: true };

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.restaurant = { userId: authorId };
    }

    const restaurantReservations = await prisma.restaurantReservation.findMany({
      where: query,
      include: {
        restaurant: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = restaurantReservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      restaurant: {
        ...reservation.restaurant,
        createdAt: reservation.restaurant.createdAt.toISOString(),
        images: reservation.restaurant.images.map((image) => ({
          ...image,
          createdAt: image.createdAt.toISOString(),
          updatedAt: image.updatedAt.toString(),
        })),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
