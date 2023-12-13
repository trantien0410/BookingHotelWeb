import prisma from "@/app/libs/prismadb";

interface IParams {
  restaurantId?: string;
}

export default async function getRestaurantListingById(params: IParams) {
  try {
    const { restaurantId } = params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      include: {
        user: true,
        images: true,
      },
    });

    if (!restaurant) {
      return null;
    }

    return {
      ...restaurant,
      createdAt: restaurant.createdAt.toString(),
      user: {
        ...restaurant.user,
        createdAt: restaurant.user.createdAt.toString(),
        updatedAt: restaurant.user.updatedAt.toString(),
        emailVerified: restaurant.user.emailVerified?.toString() || null,
      },
      images: restaurant.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toString(),
      })),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
