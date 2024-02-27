import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getVehicleListingById from "@/app/actions/carActions/getVehicleListingById";
import getVehicleReservations from "@/app/actions/carActions/getVehicleReservations";
import VehicleClient from "./VehicleClient";
import { getVehicleReservationsCount } from "@/app/actions/carActions/getVehicleReservationCount";
import { getReservationsCountByUser } from "@/app/actions/getReservationCountByUser";

interface IParams {
  vehicleId?: string;
}

const VehiclePage = async ({ params }: { params: IParams }) => {
  const vehicle = await getVehicleListingById(params);
  const reservations = await getVehicleReservations(params);
  const currentUser = await getCurrentUser();
  const reservationsCount = await getVehicleReservationsCount();
  const hotelReservationsCount = currentUser
    ? await getReservationsCountByUser(currentUser.id)
    : 0;

  if (!vehicle) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <VehicleClient
        vehicle={vehicle}
        reservations={reservations}
        reservationsCount={reservationsCount}
        hotelReservationsCount={hotelReservationsCount}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default VehiclePage;
