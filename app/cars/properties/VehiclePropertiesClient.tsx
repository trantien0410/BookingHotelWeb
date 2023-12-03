"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeUser, SafeVehicle } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import VehicleListingCard from "../components/VehicleListingCard";

interface VehiclePropertiesClientProps {
  vehicles: SafeVehicle[];
  currentUser?: SafeUser | null;
}

const VehiclePropertiesClient: React.FC<VehiclePropertiesClientProps> = ({
  vehicles,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/vehicles/listings/${id}`)
        .then(() => {
          toast.success("Vehicle deleted");
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

    document.title = `${currentUser?.name?.split(" ")[0]}'s Vehicles`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [currentUser]);

  return (
    <Container>
      <Heading title="Vehicles" subtitle="List of your vehicles" />
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
        {vehicles.map((vehicle: any) => (
          <VehicleListingCard
            images={vehicle.images}
            key={vehicle.id}
            data={vehicle}
            actionId={vehicle.id}
            onAction={onDelete}
            disabled={deletingId === vehicle.id}
            actionLabel="Delete vehicle"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default VehiclePropertiesClient;
