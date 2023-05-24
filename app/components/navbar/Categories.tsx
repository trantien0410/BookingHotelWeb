"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiFamilyHouse,
  GiFlowerPot,
  GiForestCamp,
  GiIsland,
  GiTreehouse,
  GiWindmill,
} from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { BsSnow, BsWater } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineCabin, MdOutlineVilla } from "react-icons/md";
import { HiOutlineHomeModern } from "react-icons/hi2";

import CategoryBox from "../CategoryBox";
import Container from "../Container";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdSwitch } from "react-icons/io";

export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Windmills",
    icon: GiWindmill,
    description: "This property is has windmills!",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This is property has a beautiful pool!",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has skiing activies!",
  },
  {
    label: "Castles",
    icon: GiCastle,
    description: "This property is an ancient castle!",
  },
  {
    label: "Caves",
    icon: GiCaveEntrance,
    description: "This property is in a spooky cave!",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "This property offers camping activities!",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This property is in arctic environment!",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This property is in the desert!",
  },
  {
    label: "Barns",
    icon: GiBarn,
    description: "This property is in a barn!",
  },
  {
    label: "Treehouse",
    icon: GiTreehouse,
    description:
      "Experience a unique and cozy getaway in a treehouse surrounded by nature.",
  },
  {
    label: "Garden",
    icon: GiFlowerPot,
    description: "Relax in beautiful gardens and green spaces.",
  },
  {
    label: "Mansion",
    icon: GiFamilyHouse,
    description:
      "Live like royalty in these grand and luxurious estates, complete with lavish amenities and sprawling grounds.",
  },
  {
    label: "Tiny home",
    icon: HiOutlineHomeModern,
    description:
      "Experience the cozy and minimalist lifestyle in a compact home, often with unique and space-saving designs.",
  },

  {
    label: "Cabin",
    icon: MdOutlineCabin,
    description:
      "Experience rustic living in a cozy cabin. Perfect for a romantic getaway or a peaceful retreat in nature.",
  },

  {
    label: "Lakefront",
    icon: BsWater,
    description:
      "Enjoy lakefront homes with beautiful views and water activities like fishing and boating.",
  },
  {
    label: "Romantic",
    icon: AiOutlineHeart,
    description:
      "Experience the ultimate romantic getaway in some of the world's most beautiful destinations.",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description:
      "Experience luxury camping in beautiful natural settings with all the amenities of home.",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This property is brand new and luxurious!",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  if (!isMainPage) {
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
        {categories.map((item, index) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
            firstCategory={index === 0}
            lastCategory={index === categories.length - 1}
          />
        ))}
      </div>
      <div
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
      </div>
    </Container>
  );
};

export default Categories;
