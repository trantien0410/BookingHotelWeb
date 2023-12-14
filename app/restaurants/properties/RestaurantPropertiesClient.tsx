"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeRestaurant, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import RestaurantListingCard from "../components/RestaurantListingCard";

interface RestaurantPropertiesClientProps {
  restaurants: SafeRestaurant[];
  currentUser?: SafeUser | null;
}

const RestaurantPropertiesClient: React.FC<RestaurantPropertiesClientProps> = ({
  restaurants,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/restaurants/listings/${id}`)
        .then(() => {
          toast.success("Restaurants deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  useEffect(() => {
    const originalTitle = document.title; // Store the original document title

    document.title = `${currentUser?.name?.split(" ")[0]}'s Restaurants`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [currentUser]);

  return (
    <Container>
      <Heading title="Restaurants" subtitle="List of your restaurants" />
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
        {restaurants.map((restaurant: any) => (
          <RestaurantListingCard
            images={restaurant.images}
            key={restaurant.id}
            data={restaurant}
            actionId={restaurant.id}
            onAction={onDelete}
            disabled={deletingId === restaurant.id}
            actionLabel="Delete restaurant"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default RestaurantPropertiesClient;
