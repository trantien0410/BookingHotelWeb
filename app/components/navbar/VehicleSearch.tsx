"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { differenceInDays } from "date-fns";

import useCountries from "@/app/hooks/useCountries";
import useVehicleSearchModal from "@/app/hooks/useVehicleSearchModal";

const VehicleSearch = () => {
  const vehicleSearchModal = useVehicleSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const seatCount = params?.get("seatCount");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return "Anywhere";
  }, [locationValue, getByValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);

      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Days`;
    }

    return "Any Day";
  }, [startDate, endDate]);

  const seatLabel = useMemo(() => {
    if (seatCount) {
      return `${seatCount} Seats`;
    }

    return "Add Seats";
  }, [seatCount]);

  return (
    <div
      onClick={vehicleSearchModal.onOpen}
      className="
        border-[1px]
        w-full
        md:w-auto
        py-1.5
        rounded-full
        bg-white
        drop-shadow
        hover:shadow-md
        hover:drop-shadow-0
        hover:transition
        hover:ease-in-out
        transition
        cursor-pointer
        lg:absolute
        lg:left-1/2
        lg:-translate-x-1/2
        lg:transition-none
      "
    >
      <div
        className="
          flex 
          flex-row 
          items-center 
          justify-between
        "
      >
        <div
          className="
            text-sm
            font-bold
            px-6
            truncate
          "
        >
          {locationLabel}
        </div>
        <div
          className="
            hidden
            sm:block
            text-sm
            font-bold
            px-6
            border-x-[2px]
            flex-1
            text-center
            truncate
          "
        >
          {durationLabel}
        </div>
        <div
          className="
            text-sm 
            pl-6 
            pr-2 
            text-gray-600 
            flex 
            flex-row 
            items-center 
            gap-3
          "
        >
          <div className="hidden sm:block truncate">{seatLabel}</div>
          <div
            className="
              p-2 
              bg-rose-500 
              rounded-full 
              text-white
            "
          >
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearch;
