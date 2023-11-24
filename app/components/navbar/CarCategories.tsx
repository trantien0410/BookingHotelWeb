"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { IoCarSportOutline } from "react-icons/io5";
import {
  MdDirectionsCar,
  MdOutlineElectricCar,
  MdOutlinePedalBike,
} from "react-icons/md";
import { LuCar } from "react-icons/lu";
import { PiCarProfile } from "react-icons/pi";
import { LiaTruckPickupSolid } from "react-icons/lia";

import CarCategoryBox from "../CarCategoryBox";
import Container from "../Container";
import { IoMdSwitch } from "react-icons/io";
import { GiRaceCar, GiScooter } from "react-icons/gi";

export const carCategories = [
  {
    label: "Sedan",
    icon: MdDirectionsCar,
    description: "This car is suitable for small family.",
  },
  {
    label: "SUV",
    icon: PiCarProfile,
    description: "This car is suitable for huge family.",
  },
  {
    label: "Sport",
    icon: IoCarSportOutline,
    description: "This car is suitable for speedy person.",
  },
  {
    label: "Coupe",
    icon: GiRaceCar,
    description:
      "A coupe is a fixed-roof car with a sloping rear roofline and one or two rows of seats.",
  },
  {
    label: "Pickup Truck",
    icon: LiaTruckPickupSolid,
    description:
      "A pickup truck or pickup is a light-duty truck that has an enclosed cabin.",
  },
  {
    label: "Lux",
    icon: LuCar,
    description: "This car is brand new and luxurious!.",
  },
  {
    label: "Electric",
    icon: MdOutlineElectricCar,
    description: "This car is fully run by electronic.",
  },
  {
    label: "Bike",
    icon: MdOutlinePedalBike,
    description: "This bike is friendly and convenient with environment.",
  },
  {
    label: "Scooter",
    icon: GiScooter,
    description: "This scooter is the best opt for moving in city.",
  },
];

const CarCategories = () => {
  const params = useSearchParams();
  const carCategory = params?.get("carCategory");
  const pathname = usePathname();
  const isCarPage = pathname === "/cars";

  if (!isCarPage) {
    return null;
  }

  return (
    <Container categoryContainer>
      <div
        className="
          pt-2
          flex
          flex-row
          gap-4
          items-center
          justify-between
          overflow-x-auto
          w-full
        "
      >
        {carCategories.map((item, index) => (
          <CarCategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={carCategory === item.label}
            firstCategory={index === 0}
            lastCategory={index === carCategories.length - 1}
          />
        ))}
      </div>
      {/* <div
        onClick={() => {}}
        className="
                        hidden
                        sm:flex
                        p-3 
                        border 
                        border-neutral-400 
                        text-semibold 
                        rounded-xl 
                        flex-row 
                        items-center 
                        gap-2 
                        font-bold 
                        text-xs 
                        cursor-pointer 
                        hover:shadow-md
                        transition
                        ease-in-out
                        duration-150
                        ml-14
                    "
      >
        <IoMdSwitch size={21} /> Filters
      </div> */}
    </Container>
  );
};

export default CarCategories;
