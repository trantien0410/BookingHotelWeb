"use client";

import { usePathname, useSearchParams } from "next/navigation";
import RestaurantCategoryBox from "../RestaurantCategoryBox";
import Container from "../Container";

import { IoDiamond } from "react-icons/io5";
import { IoMdSwitch } from "react-icons/io";
import { GiSteak, GiSushis } from "react-icons/gi";
import {
  FaAppleAlt,
  FaBirthdayCake,
  FaCoffee,
  FaFish,
  FaHamburger,
  FaLeaf,
  FaPizzaSlice,
  FaStreetView,
  FaUsers,
  FaUtensilSpoon,
  FaUtensils,
} from "react-icons/fa";

export const restaurantCategories = [
  {
    label: "Fine Dining",
    icon: FaUtensils,
    description:
      "Indulge in exquisite cuisine with a luxurious dining experience.",
  },
  {
    label: "Casual Dining",
    icon: FaUtensilSpoon,
    description:
      "Relaxed atmosphere with a diverse menu for a laid-back dining experience.",
  },
  {
    label: "Fast Food",
    icon: FaHamburger,
    description: "Quick and convenient meals for those on the go.",
  },
  {
    label: "Vegetarian/Vegan",
    icon: FaLeaf,
    description:
      "Delicious plant-based dishes catering to vegetarian and vegan preferences.",
  },
  {
    label: "Seafood Specialties",
    icon: FaFish,
    description:
      "Enjoy a variety of fresh and expertly prepared seafood dishes.",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This restaurant is brand new and luxurious!",
  },
  {
    label: "Family-Friendly",
    icon: FaUsers,
    description:
      "A welcoming environment with a menu suitable for the entire family.",
  },
  {
    label: "Italian Cuisine",
    icon: FaPizzaSlice,
    description:
      "Savor the flavors of Italy with authentic pasta, pizza, and more.",
  },
  {
    label: "Asian Fusion",
    icon: GiSushis,
    description:
      "Experience a blend of Asian flavors with creative and diverse culinary influences.",
  },
  {
    label: "Coffeehouse/Café",
    icon: FaCoffee,
    description:
      "Relax with a cup of freshly brewed coffee and a selection of pastries.",
  },
  {
    label: "Steakhouse",
    icon: GiSteak,
    description:
      "Indulge in premium cuts of meat expertly prepared to your liking.",
  },
  {
    label: "Street Food",
    icon: FaStreetView,
    description:
      "Discover the vibrant and diverse world of street food from around the globe.",
  },
  {
    label: "Bakery/Dessert Shop",
    icon: FaBirthdayCake,
    description:
      "Satisfy your sweet tooth with a variety of freshly baked goods and desserts.",
  },
  {
    label: "Health Food",
    icon: FaAppleAlt,
    description:
      "Nourish your body with wholesome and nutritious options for a healthy dining experience.",
  },
];

const RestaurantCategories = () => {
  const params = useSearchParams();
  const restaurantCategory = params?.get("restaurantCategory");
  const pathname = usePathname();
  const isRestaurantPage = pathname === "/restaurants";

  if (!isRestaurantPage) {
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
        {restaurantCategories.map((item, index) => (
          <RestaurantCategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={restaurantCategory === item.label}
            firstCategory={index === 0}
            lastCategory={index === restaurantCategories.length - 1}
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

export default RestaurantCategories;
