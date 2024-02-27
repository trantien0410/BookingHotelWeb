import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getRestaurantListingById from "@/app/actions/restaurantActions/getRestaurantListingById";
import getRestaurantReservations from "@/app/actions/restaurantActions/getRestaurantReservations";
import RestaurantClient from "./RestaurantClient";
import { getRestaurantReservationsCount } from "@/app/actions/restaurantActions/getRestaurantReservationCount";
import { getReservationsCountByUser } from "@/app/actions/getReservationCountByUser";

interface IParams {
  restaurantId?: string;
}

const RestaurantPage = async ({ params }: { params: IParams }) => {
  const restaurant = await getRestaurantListingById(params);
  const reservations = await getRestaurantReservations(params);
  const currentUser = await getCurrentUser();
  const reservationsCount = await getRestaurantReservationsCount();
  const hotelReservationsCount = currentUser
  ? await getReservationsCountByUser(currentUser.id)
  : 0;

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
        reservationsCount={reservationsCount}
        hotelReservationsCount={hotelReservationsCount}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default RestaurantPage;
