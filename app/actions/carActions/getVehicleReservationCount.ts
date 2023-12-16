import prisma from "@/app/libs/prismadb";

export const getVehicleReservationsCount = async () => {
  const reservationsCount = await prisma.vehicleReservation.count({
    where: {
      isPaid: true,
    },
  });

  return reservationsCount;
};
