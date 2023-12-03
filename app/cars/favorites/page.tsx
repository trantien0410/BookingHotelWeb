import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import VehicleFavoritesClient from "./VehicleFavoritesClient";
import getVehicleFavoriteListings from "@/app/actions/carActions/getVehicleFavoriteListings";

const ListingPage = async () => {
  const vehicles = await getVehicleFavoriteListings();

  const currentUser = await getCurrentUser();

  if (vehicles.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite vehicles."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <VehicleFavoritesClient vehicles={vehicles} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ListingPage;
