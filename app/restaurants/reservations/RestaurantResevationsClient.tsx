"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeRestaurantReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import RestaurantListingCard from "../components/RestaurantListingCard";

interface RestaurantReservationsClientProps {
  reservations: SafeRestaurantReservation[];
  currentUser?: SafeUser | null;
}

const RestaurantReservationsClient: React.FC<
  RestaurantReservationsClientProps
> = ({ reservations, currentUser }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/restaurants/reservations/${id}`)
        .then(() => {
          toast.success("Reservation canceled");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  useEffect(() => {
    const originalTitle = document.title; // Store the original document title

    document.title = `${currentUser?.name?.split(" ")[0]}'s Reservations`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [currentUser]);

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your restaurants" />
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
        {reservations.map((reservation: any) => (
          <RestaurantListingCard
            images={reservation.restaurant.images}
            key={reservation.id}
            data={reservation.restaurant}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default RestaurantReservationsClient;
