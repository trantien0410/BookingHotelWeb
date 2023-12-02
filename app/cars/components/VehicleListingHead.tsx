"use client";

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser, SafeVehicleImage } from "@/app/types";

import { Tab } from "@headlessui/react";
import { cn } from "@/app/libs/utils";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Heading from "@/app/components/Heading";
import VehicleHeartButton from "@/app/components/VehicleHeartButton";

interface VehicleListingHeadProps {
  title: string;
  detailedAddress: string;
  countryValue: string;
  stateValue: string;
  images: SafeVehicleImage[];
  id: string;
  currentUser?: SafeUser | null;
}

const VehicleListingHead: React.FC<VehicleListingHeadProps> = ({
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImages = () => {
    setCurrentIndex((oldIndex) =>
      oldIndex + 4 < images.length ? oldIndex + 4 : oldIndex
    );
  };

  const prevImages = () => {
    setCurrentIndex((oldIndex) =>
      oldIndex - 4 >= 0 ? oldIndex - 4 : oldIndex
    );
  };

  return (
    <>
      <Heading
        title={title}
        subtitle={`${detailedAddress}, ${state?.label}, ${country?.label}`}
      />
      <Tab.Group as="div" className="flex flex-col-reverse">
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {images
              .slice(currentIndex, currentIndex + 4)
              .map((image, index) => (
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
                      {index === 3 && images.length - currentIndex > 4 && (
                        <span
                          className="
                                  inset-0 rounded-md text-white items-center 
                                  hover:bg-[rgba(0,0,0,0.5)] absolute 
                                  justify-center flex text-xl
                                  "
                        >
                          +{images.length - currentIndex - 4}
                        </span>
                      )}
                    </div>
                  )}
                </Tab>
              ))}
          </Tab.List>
          {images.length > 4 && (
            <div className="flex flex-col-1 mt-1">
              <ArrowLeft className="h-5 w-5 ml-auto" onClick={prevImages} />
              <ArrowRight className="h-5 w-5" onClick={nextImages} />
            </div>
          )}
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
                  <VehicleHeartButton
                    vehicleId={id}
                    currentUser={currentUser}
                  />
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default VehicleListingHead;
