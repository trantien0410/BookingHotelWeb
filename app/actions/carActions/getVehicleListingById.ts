import prisma from "@/app/libs/prismadb";

interface IParams {
  vehicleId?: string;
}

export default async function getVehicleListingById(params: IParams) {
  try {
    const { vehicleId } = params;

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
      include: {
        user: true,
        images: true,
      },
    });

    if (!vehicle) {
      return null;
    }

    return {
      ...vehicle,
      createdAt: vehicle.createdAt.toString(),
      user: {
        ...vehicle.user,
        createdAt: vehicle.user.createdAt.toString(),
        updatedAt: vehicle.user.updatedAt.toString(),
        emailVerified: vehicle.user.emailVerified?.toString() || null,
      },
      images: vehicle.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toString(),
      })),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
