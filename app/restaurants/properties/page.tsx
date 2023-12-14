import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import RestaurantPropertiesClient from "./RestaurantPropertiesClient";
import getRestaurantListings from "@/app/actions/restaurantActions/getRestaurantListings";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const restaurants = await getRestaurantListings({ userId: currentUser.id });

  if (restaurants.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No restaurants found"
          subtitle="Looks like you have no restaurants."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <RestaurantPropertiesClient
        restaurants={restaurants}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default PropertiesPage;
