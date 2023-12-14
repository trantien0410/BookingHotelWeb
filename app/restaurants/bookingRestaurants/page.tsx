import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getRestaurantReservations from "@/app/actions/restaurantActions/getRestaurantReservations";
import BookingRestaurantClient from "./BookingRestaurantsClient";

const BookingRestaurantPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  const reservations = await getRestaurantReservations({
    userId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No booked restaurants found"
          subtitle="Looks like you haven't reserved any restaurants."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <BookingRestaurantClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default BookingRestaurantPage;
