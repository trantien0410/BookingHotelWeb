"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { GrGroup } from "react-icons/gr";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaShower } from "react-icons/fa";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  hyperlink: string | null;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
}
const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  hyperlink,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            justify-between
            gap-3
            mb-4
          "
        >
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} large />
        </div>
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div
            className="
            flex
            flex-row
            gap-3
            items-center
            justify-center
            py-6
            border
            rounded-xl
            border-neutral-300
            flex-grow
          "
          >
            <GrGroup size={24} />
            {guestCount} {guestCount > 1 ? "guests" : "guest"}
          </div>
          <div
            className="
            flex
            flex-row
            gap-3
            items-center
            justify-center
            py-6 border
            rounded-xl
            border-neutral-300
            flex-grow
          "
          >
            <MdOutlineBedroomParent size={24} />
            {roomCount} {roomCount > 1 ? "rooms" : "room"}
          </div>
          <div
            className="
            flex 
            flex-row 
            gap-3 
            items-center 
            justify-center 
            py-6 
            border 
            rounded-xl 
            border-neutral-300 
            flex-grow
          "
          >
            <FaShower size={24} />
            {bathroomCount} {bathroomCount > 1 ? "bathrooms" : "bathroom"}
          </div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description}
        />
      )}
      {hyperlink && (
        <>
          <hr />
          <div>
            <div className="text-xl font-semibold">
              More experience via our website!
            </div>
            <div className="flex flex-cols-1">
              <a
                className="
                    relative
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    rounded-lg
                    hover:opacity-80
                    transition
                    w-full
                    bg-white
                    border-black
                    text-black
                    py-2
                    text-md
                    font-light
                    "
                href={hyperlink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Jump to our page
              </a>
            </div>
          </div>
        </>
      )}
      <hr className="my-6" />
      <div className="text-xl font-semibold">About this place</div>
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {description}
      </div>
      <hr />
      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;
