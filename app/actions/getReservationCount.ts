import prisma from "@/app/libs/prismadb";

export const getReservationsCount = async () => {
  const reservationsCount = await prisma.reservation.count({
    where: {
      isPaid: true,
    },
  });

  return reservationsCount;
};
