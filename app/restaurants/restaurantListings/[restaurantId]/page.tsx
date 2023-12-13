import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getRestaurantListingById from "@/app/actions/restaurantActions/getRestaurantListingById";
import getRestaurantReservations from "@/app/actions/restaurantActions/getRestaurantReservations";
import RestaurantClient from "./RestaurantClient";

interface IParams {
  restaurantId?: string;
}

const RestaurantPage = async ({ params }: { params: IParams }) => {
  const restaurant = await getRestaurantListingById(params);
  const reservations = await getRestaurantReservations(params);
  const currentUser = await getCurrentUser();

  if (!restaurant) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <RestaurantClient
        restaurant={restaurant}
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default RestaurantPage;
