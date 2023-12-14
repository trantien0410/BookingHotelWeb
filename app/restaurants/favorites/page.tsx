import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import RestaurantFavoritesClient from "./RestaurantFavoritesClient";
import getRestaurantFavoriteListings from "@/app/actions/restaurantActions/getRestaurantFavoriteListings";

const ListingPage = async () => {
  const restaurants = await getRestaurantFavoriteListings();

  const currentUser = await getCurrentUser();

  if (restaurants.length === 0) {
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
      <RestaurantFavoritesClient
        restaurants={restaurants}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
