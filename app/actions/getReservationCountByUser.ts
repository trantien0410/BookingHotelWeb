import prisma from "@/app/libs/prismadb";

export const getReservationsCountByUser = async (userId: string) => {
  const reservationsCount = await prisma.reservation.count({
    where: {
      userId: userId,
      isPaid: true,
    },
  });

  return reservationsCount;
};
