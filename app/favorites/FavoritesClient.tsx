"use client";

import { useEffect } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeImage, SafeListing, SafeUser } from "../types";

interface FavoritesClientProps {
  listings: SafeListing[] & {
    images: SafeImage[];
  };
  currentUser?: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
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
        subtitle="List of places you have favorite !"
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
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
            images={listing.images}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
