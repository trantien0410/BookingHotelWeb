"use client";

import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import dynamic from "next/dynamic";
import { GrGroup } from "react-icons/gr";
import Avatar from "@/app/components/Avatar";
import ListingCategory from "@/app/components/listings/ListingCategory";

const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

interface VehicleListingInfoProps {
  user: SafeUser;
  description: string;
  seatCount: number;
  phoneContact: string;
  hyperlink: string | null;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  latlng: number[];
}
const VehicleListingInfo: React.FC<VehicleListingInfoProps> = ({
  user,
  description,
  seatCount,
  category,
  latlng,
  phoneContact,
  hyperlink,
}) => {
  const coordinates = latlng;
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
            {seatCount} {seatCount > 1 ? "seats" : "seat"}
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
      <hr className="my-6" />
      <div className="text-xl font-semibold">About this place</div>
      <div
        className="
      text-lg font-light text-neutral-500 whitespace-pre-wrap"
      >
        {description}
      </div>
      <hr className="my-6" />
      <div className="text-xl font-semibold">Contact Us</div>
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        Phone Number: {phoneContact}
      </div>
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
                    text-rose-500
                    text-bold
                    py-2
                    text-md
                    font-semibold
                    "
                href={hyperlink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Our Original Website !
              </a>
            </div>
          </div>
        </>
      )}
      <hr />
      <Map center={coordinates} />
    </div>
  );
};

export default VehicleListingInfo;
