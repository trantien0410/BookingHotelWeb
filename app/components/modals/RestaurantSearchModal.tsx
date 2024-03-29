"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import { Slider } from "antd";
import StateSelect, { StateSelectValue } from "../inputs/StateSelect";
import { getCoordinates } from "@/app/libs/coordinate";
import useRestaurantSearchModal from "@/app/hooks/useRestaurantSearchModal";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
  PRICE = 3,
}

const RestaurantSearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const restaurantSearchModal = useRestaurantSearchModal();

  const [coordinates, setCoordinates] = useState([0, 0]);

  const [country, setCountry] = useState<CountrySelectValue>();
  const [state, setState] = useState<StateSelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [priceRange, setPriceRange] = useState([20, 50]);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [country, state]
  );

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (country) {
        const finalAddress = `${state?.label}, ${country?.label}`;
        const coords = await getCoordinates(finalAddress);
        setCoordinates(coords);
      }
    };

    fetchCoordinates();
  }, [state, country]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      countryValue: country?.value,
      stateValue: state?.value,
      guestCount,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/restaurants",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    restaurantSearchModal.onClose();

    router.push(url);
  }, [
    step,
    restaurantSearchModal,
    country,
    state,
    router,
    guestCount,
    dateRange,
    onNext,
    priceRange,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna have a meal ?"
        subtitle="Find the perfect location!"
      />
      <CountrySelect
        value={country}
        onChange={(value) => setCountry(value as CountrySelectValue)}
      />
      {country && (
        <StateSelect
          countryCode={country.value}
          value={state}
          onChange={(value) => {
            setState(value as StateSelectValue);
          }}
        />
      )}
      <hr />
      <Map center={coordinates} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to have a meal ?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect restaurant!"
        />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guess"
          subtitle="How many guests are coming?"
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Set your price range"
          subtitle="Adjust the slider to set your price range"
        />
        <Slider
          range
          value={priceRange}
          onChange={(value) => setPriceRange(value)}
          min={0}
          max={1000}
          tipFormatter={(value) => `$${value}`}
        />
      </div>
    );
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restaurantSearchModal.onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [restaurantSearchModal]);

  return (
    <Modal
      isOpen={restaurantSearchModal.isOpen}
      onClose={restaurantSearchModal.onClose}
      onSubmit={onSubmit}
      title="Filter"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RestaurantSearchModal;
