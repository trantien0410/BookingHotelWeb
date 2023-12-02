import prisma from "@/app/libs/prismadb";

interface IParams {
  vehicleId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getVehicleReservations(params: IParams) {
  try {
    const { vehicleId, userId, authorId } = params;

    const query: any = { isPaid: true };

    if (vehicleId) {
      query.vehicleId = vehicleId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.vehicle = { userId: authorId };
    }

    const vehicleReservations = await prisma.vehicleReservation.findMany({
      where: query,
      include: {
        vehicle: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = vehicleReservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      vehicle: {
        ...reservation.vehicle,
        createdAt: reservation.vehicle.createdAt.toISOString(),
        images: reservation.vehicle.images.map((image) => ({
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
