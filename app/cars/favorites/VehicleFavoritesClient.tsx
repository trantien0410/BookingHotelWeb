"use client";

import { useEffect } from "react";
import { SafeUser, SafeVehicle } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import VehicleListingCard from "../components/VehicleListingCard";

interface VehicleFavoritesClientProps {
  vehicles: SafeVehicle[];
  currentUser?: SafeUser | null;
}

const VehicleFavoritesClient: React.FC<VehicleFavoritesClientProps> = ({
  vehicles,
  currentUser,
}) => {
  useEffect(() => {
    const originalTitle = document.title; // Store the original document title

    document.title = `${currentUser?.name?.split(" ")[0]}'s Favorites`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [currentUser]);

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of vehicles you have favorite !"
      />
      <div
        className="
            mt-10
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
        "
      >
        {vehicles.map((vehicle) => (
          <VehicleListingCard
            currentUser={currentUser}
            key={vehicle.id}
            data={vehicle}
            images={vehicle.images}
          />
        ))}
      </div>
    </Container>
  );
};

export default VehicleFavoritesClient;
