"use client";

import Container from "@/app/components/Container";
import useLoginModal from "@/app/hooks/useLoginModal";
import {
  SafeRestaurant,
  SafeRestaurantReservation,
  SafeUser,
} from "@/app/types";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { differenceInDays, eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import { IoDiamondOutline } from "react-icons/io5";
import { restaurantCategories } from "@/app/components/navbar/RestaurantCategories";
import RestaurantListingHead from "../../components/RestaurantListingHead";
import RestaurantListingInfo from "../../components/RestaurantListingInfo";
import RestaurantListingReservation from "../../components/RestaurantListingReservation";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: SafeRestaurantReservation[];
  restaurant: SafeRestaurant & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const RestaurantClient: React.FC<ListingClientProps> = ({
  restaurant,
  reservations = [],
  currentUser,
}) => {
  const searchParams = useSearchParams();
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(restaurant.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [daysCount, setDaysCount] = useState(1);
  const [tax, setTax] = useState<number>(0);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const fees = [
    {
      name: "Cleaning Fee",
      amount: 60,
    },
    {
      name: "Airbnb Service Fee",
      amount: 30,
    },
  ];

  const reCalculateTotal = (previousTotal: number, currentTax: number) => {
    let total = previousTotal;
    fees.forEach((fee) => {
      total = total + fee.amount;
    });
    return total + currentTax;
  };

  useEffect(() => {
    setTax(Number((totalPrice * 0.13).toFixed(2)));
  }, [totalPrice]);

  const newTotal = reCalculateTotal(totalPrice, tax);

  useEffect(() => {
    if (searchParams?.get("success")) {
      toast.success("Payment completed successfully.");
      setDateRange(initialDateRange);
      router.push("/restaurants/bookingRestaurants");
    }
    if (searchParams?.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, router]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    axios
      .post("/api/restaurants/reservations", {
        newTotal,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        restaurantId: restaurant?.id,
      })
      .then((response) => {
        window.location = response.data.url;
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [newTotal, dateRange, restaurant?.id, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      setDaysCount(dayCount);

      if (dayCount && restaurant.price) {
        setTotalPrice(dayCount * restaurant.price);
      } else {
        setTotalPrice(restaurant.price);
      }
    }
  }, [dateRange, restaurant.price]);

  const category = useMemo(() => {
    return restaurantCategories.find(
      (items) => items.label === restaurant.category
    );
  }, [restaurant.category]);

  useEffect(() => {
    const originalTitle = document.title; // Store the original document title

    document.title = `${restaurant.title} - Restaurant for Booking in ${restaurant.countryValue} - Vatibnb`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [restaurant.title, restaurant.countryValue]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <RestaurantListingHead
            title={restaurant.title}
            images={restaurant.images}
            countryValue={restaurant.countryValue}
            stateValue={restaurant.stateValue}
            detailedAddress={restaurant.detailedAddress}
            id={restaurant.id}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <RestaurantListingInfo
              user={restaurant.user}
              category={category}
              description={restaurant.description}
              guessCount={restaurant.guessCount}
              latlng={restaurant.latlng}
              hyperlink={restaurant.hyperlink}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <RestaurantListingReservation
                price={restaurant.price}
                totalPerNight={totalPrice}
                totalPrice={newTotal}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                daysCount={daysCount}
                fees={fees}
                tax={tax}
              />
              <div
                className="
                mt-4 
                border 
                border-neutral-300 
                rounded-xl 
                p-6 
                flex 
                flex-row 
                items-center 
                justify-between
              "
              >
                <div className="font-light">
                  <strong className="font-semibold">
                    This is a rare find.
                  </strong>{" "}
                  {restaurant.user.name?.split(" ")[0]}&apos;s restaurant on
                  VatiBnb is usually fully booked.
                </div>
                <IoDiamondOutline className="text-rose-500 ml-4" size={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RestaurantClient;
