"use client";

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeRestaurantImage, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import RestaurantHeartButton from "@/app/components/RestaurantHeartButton";
import { Tab } from "@headlessui/react";
import { cn } from "@/app/libs/utils";
import { useState } from "react";

interface RestaurantListingHeadProps {
  title: string;
  detailedAddress: string;
  countryValue: string;
  stateValue: string;
  images: SafeRestaurantImage[];
  id: string;
  currentUser?: SafeUser | null;
}

const RestaurantListingHead: React.FC<RestaurantListingHeadProps> = ({
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

  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 4;

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  return (
    <>
      <Heading
        title={title}
        subtitle={`${detailedAddress}, ${state?.label}, ${country?.label}`}
      />
      <Tab.Group
        as="div"
        className="flex flex-col-reverse"
        key={currentPage}
        defaultIndex={0}
      >
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {paginatedImages.map((image, index) => (
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
                    {index === 3 &&
                      images.length - currentPage > imagesPerPage && (
                        <span
                          className="
                                  inset-0 rounded-md text-white items-center 
                                  hover:bg-[rgba(0,0,0,0.5)] absolute 
                                  justify-center flex text-xl
                                  "
                        >
                          +{images.length - currentPage - imagesPerPage}
                        </span>
                      )}
                  </div>
                )}
              </Tab>
            ))}
          </Tab.List>

          {images.length > imagesPerPage && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <button
                className=" relative
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        rounded-lg
                        hover:opacity-80
                        transition
                        bg-white
                        text-black
                        py-3
                        text-md
                        font-semibold"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                className=" relative
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        rounded-lg
                        hover:opacity-80
                        transition
                        bg-white
                        text-black
                        py-3
                        text-md
                        font-semibold"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={(currentPage + 1) * imagesPerPage >= images.length}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <Tab.Panels className="h-full w-full">
          {paginatedImages.map((image) => (
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
                  <RestaurantHeartButton
                    restaurantId={id}
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

export default RestaurantListingHead;
