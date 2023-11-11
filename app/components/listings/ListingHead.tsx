"use client";

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeImage, SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import { Tab } from "@headlessui/react";
import { cn } from "@/app/libs/utils";

interface ListingHeadProps {
  title: string;
  detailedAddress: string;
  countryValue: string;
  stateValue: string
  images: SafeImage[];
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  detailedAddress,
  countryValue,
  stateValue,
  images,
  id,
  currentUser,
}) => {
  const { getByValue, getStatesByCountry } = useCountries();

  const country = getByValue(countryValue);
  const states = getStatesByCountry(countryValue);

  const state = states.find((state) => state.value === stateValue);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${detailedAddress}, ${state?.label}, ${country?.label}`}
      />
      <Tab.Group as="div" className="flex flex-col-reverse">
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map((image) => (
              <Tab
                key={image.id}
                className=" 
                  relative
                  flex
                  aspect-square
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-md
                  bg-white
                  "
              >
                {({ selected }) => (
                  <div>
                    <span
                      className="
                        absolute h-full w-full aspect-square 
                        inset-0 overflow-hidden rounded-md"
                    >
                      <Image
                        fill
                        src={image.url}
                        alt=""
                        className="object-cover object-center"
                      />
                    </span>
                    <span
                      className={cn(
                        "absolute inset-0 rounded-md ring-2 ring-offset-2",
                        selected ? "ring-black" : "ring-transparent"
                      )}
                    />
                  </div>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="h-full w-full">
          {images.map((image) => (
            <Tab.Panel key={image.id}>
              <div
                className="
                w-full
                h-[60vh]
                overflow-hidden 
                rounded-xl
                sm:rounded-lg
                relative"
              >
                <Image
                  fill
                  src={image.url}
                  alt=""
                  className="object-cover object-center"
                />
                <div
                  className="
                    absolute
                    top-5
                    right-5
                  "
                >
                  <HeartButton listingId={id} currentUser={currentUser} />
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default ListingHead;
