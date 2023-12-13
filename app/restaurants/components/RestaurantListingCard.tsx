"use client";

import useCountries from "@/app/hooks/useCountries";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  SafeRestaurant,
  SafeRestaurantImage,
  SafeRestaurantReservation,
  SafeUser,
} from "@/app/types";
import Button from "@/app/components/Button";
import RestaurantHeartButton from "@/app/components/RestaurantHeartButton";
interface RestaurantListingCardProps {
  data: SafeRestaurant;
  reservation?: SafeRestaurantReservation;
  images: SafeRestaurantImage[];
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}
const RestaurantListingCard: React.FC<RestaurantListingCardProps> = ({
  data,
  reservation,
  images,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue, getStatesByCountry } = useCountries();

  const country = getByValue(data.countryValue);
  const states = getStatesByCountry(data.countryValue);

  const state = states.find((state) => state.value === data.stateValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);
  return (
    <div
      className="col-span-1 cursor-pointer group"
      onClick={() => router.push(`/restaurants/restaurantListings/${data.id}`)}
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
        "
        >
          <Image
            src={images?.[0]?.url}
            alt="Listing"
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            priority
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
          />
          <div
            className="
            absolute
            top-4
            right-4"
          >
            <RestaurantHeartButton
              restaurantId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {state?.label}, {country?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">meal</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantListingCard;
