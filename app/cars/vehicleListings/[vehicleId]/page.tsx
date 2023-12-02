import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getVehicleListingById from "@/app/actions/carActions/getVehicleListingById";
import getVehicleReservations from "@/app/actions/carActions/getVehicleReservations";
import VehicleClient from "./VehicleClient";

interface IParams {
  vehicleId?: string;
}

const VehiclePage = async ({ params }: { params: IParams }) => {
  const vehicle = await getVehicleListingById(params);
  const reservations = await getVehicleReservations(params);
  const currentUser = await getCurrentUser();

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
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default VehiclePage;
