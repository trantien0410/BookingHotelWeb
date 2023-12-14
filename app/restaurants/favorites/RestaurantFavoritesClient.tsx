"use client";

import { useEffect } from "react";
import { SafeRestaurant, SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import RestaurantListingCard from "../components/RestaurantListingCard";

interface RestaurantFavoritesClientProps {
  restaurants: SafeRestaurant[];
  currentUser?: SafeUser | null;
}

const RestaurantFavoritesClient: React.FC<RestaurantFavoritesClientProps> = ({
  restaurants,
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
        subtitle="List of restaurants you have favorite !"
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
        {restaurants.map((restaurant) => (
          <RestaurantListingCard
            currentUser={currentUser}
            key={restaurant.id}
            data={restaurant}
            images={restaurant.images}
          />
        ))}
      </div>
    </Container>
  );
};

export default RestaurantFavoritesClient;
