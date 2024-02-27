"use client";

import Container from "@/app/components/Container";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser, SafeVehicle, SafeVehicleReservation } from "@/app/types";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { differenceInDays, eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import { IoDiamondOutline } from "react-icons/io5";
import VehicleListingHead from "../../components/VehicleListingHead";
import VehicleListingInfo from "../../components/VehicleListingInfo";
import VehicleListingReservation from "../../components/VehicleListingReservation";
import { carCategories } from "@/app/components/navbar/CarCategories";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: SafeVehicleReservation[];
  reservationsCount?: number;
  hotelReservationsCount?: number;
  vehicle: SafeVehicle & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const VehicleClient: React.FC<ListingClientProps> = ({
  vehicle,
  reservations = [],
  reservationsCount = 0,
  hotelReservationsCount = 0,
  currentUser,
}) => {
  const searchParams = useSearchParams();
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(vehicle.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [daysCount, setDaysCount] = useState(1);
  const [tax, setTax] = useState<number>(0);
  const fullyBooked = reservationsCount >= 5;

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
      router.push("/cars/rentalVehicles");
    }
    if (searchParams?.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, router]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    // Check if the user has hotel reservations
    if (hotelReservationsCount <= 0) {
      toast.error(
        "You must have at least one hotel reservation to book a vehicle."
      );
      return;
    }
    setIsLoading(true);

    axios
      .post("/api/vehicles/reservations", {
        newTotal,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        vehicleId: vehicle?.id,
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
  }, [newTotal, dateRange, vehicle?.id, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      setDaysCount(dayCount);

      if (dayCount && vehicle.price) {
        setTotalPrice(dayCount * vehicle.price);
      } else {
        setTotalPrice(vehicle.price);
      }
    }
  }, [dateRange, vehicle.price]);

  const category = useMemo(() => {
    return carCategories.find((items) => items.label === vehicle.category);
  }, [vehicle.category]);

  useEffect(() => {
    const originalTitle = document.title; // Store the original document title

    document.title = `${vehicle.title} - Cars for Rent in ${vehicle.countryValue} - Vatibnb`;

    return () => {
      // Restore the original document title when the component unmounts
      document.title = originalTitle;
    };
  }, [vehicle.title, vehicle.countryValue]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <VehicleListingHead
            title={vehicle.title}
            images={vehicle.images}
            countryValue={vehicle.countryValue}
            stateValue={vehicle.stateValue}
            detailedAddress={vehicle.detailedAddress}
            id={vehicle.id}
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
            <VehicleListingInfo
              user={vehicle.user}
              category={category}
              description={vehicle.description}
              seatCount={vehicle.seatCount}
              latlng={vehicle.latlng}
              phoneContact={vehicle.phoneContact}
              hyperlink={vehicle.hyperlink}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <VehicleListingReservation
                price={vehicle.price}
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
              {fullyBooked ? (
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
                    {vehicle.user.name?.split(" ")[0]}&apos;s vehicle on VatiBnb
                    is usually fully booked.
                  </div>
                  <IoDiamondOutline className="text-rose-500 ml-4" size={50} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VehicleClient;
