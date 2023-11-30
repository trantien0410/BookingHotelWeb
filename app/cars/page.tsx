import getVehicleListings, {
  IVehicleListingsParams,
} from "../actions/carActions/getVehicleListings";
import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ScrollToTopButton from "../components/ScrollToTop";
import VehicleListingCard from "./components/VehicleListingCard";

interface CarPageProps {
  searchParams: IVehicleListingsParams;
}

const CarPage = async ({ searchParams }: CarPageProps) => {
  const vehicleListings = await getVehicleListings(searchParams);
  const currentUser = await getCurrentUser();

  if (vehicleListings.length === 0) {
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
          {vehicleListings.map((vehicleListing: any) => {
            return (
              <VehicleListingCard
                currentUser={currentUser}
                key={vehicleListing.id}
                data={vehicleListing}
                images={vehicleListing.images}
              />
            );
          })}
        </div>
      </Container>
      <ScrollToTopButton />
    </ClientOnly>
  );
};
export default CarPage;
