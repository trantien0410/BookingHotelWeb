import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getVehicleListings from "@/app/actions/carActions/getVehicleListings";
import VehiclePropertiesClient from "./VehiclePropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const vehicles = await getVehicleListings({ userId: currentUser.id });

  if (vehicles.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No vehicles found"
          subtitle="Looks like you have no vehicles."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <VehiclePropertiesClient vehicles={vehicles} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default PropertiesPage;
