import getCurrentUser from "../actions/getCurrentUser";
import getRestaurantListings, {
  IRestaurantListingsParams,
} from "../actions/restaurantActions/getRestaurantListings";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ScrollToTopButton from "../components/ScrollToTop";
import RestaurantListingCard from "./components/RestaurantListingCard";

interface RestaurantPageProps {
  searchParams: IRestaurantListingsParams;
}

const RestaurantPage = async ({ searchParams }: RestaurantPageProps) => {
  const restaurantListings = await getRestaurantListings(searchParams);
  const currentUser = await getCurrentUser();

  if (restaurantListings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            3xl:grid-cols-5
            4xl:grid-cols-6
            gap-8
            "
        >
          {restaurantListings.map((restaurantListing: any) => {
            return (
              <RestaurantListingCard
                currentUser={currentUser}
                key={restaurantListing.id}
                data={restaurantListing}
                images={restaurantListing.images}
              />
            );
          })}
        </div>
      </Container>
      <ScrollToTopButton />
    </ClientOnly>
  );
};
export default RestaurantPage;
