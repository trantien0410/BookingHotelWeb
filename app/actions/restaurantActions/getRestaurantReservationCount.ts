import prisma from "@/app/libs/prismadb";

export const getRestaurantReservationsCount = async () => {
  const reservationsCount = await prisma.restaurantReservation.count({
    where: {
      isPaid: true,
    },
  });

  return reservationsCount;
};
