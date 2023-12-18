"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import useRestaurantRentModal from "@/app/hooks/useRestaurantRentModal";

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import StateSelect, { StateSelectValue } from "../inputs/StateSelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { getCoordinates } from "@/app/libs/coordinate";
import InputLocation from "../inputs/Input-location";
import { restaurantCategories } from "../navbar/RestaurantCategories";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
  CONTACT = 6,
  HYPERLINK = 7,
}

const RestaurantRentModal = () => {
  const router = useRouter();
  const restaurantRentModal = useRestaurantRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const [detailedAddress, setDetailedAddress] = useState("");
  const [coordinates, setCoordinates] = useState([0, 0]);

  const [country, setCountry] = useState<CountrySelectValue | undefined>(
    undefined
  );
  const [state, setState] = useState<StateSelectValue | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      detailedAddress: "",
      countryValue: null,
      stateValue: null,
      latlng: [],
      guestCount: 1,
      images: [],
      price: 1,
      title: "",
      description: "",
      phoneContact: "",
      hyperlink: "",
    },
  });

  const countryValue = watch("countryValue");
  const stateValue = watch("stateValue");
  const restaurantCategory = watch("category");
  const guestCount = watch("guestCount");
  const images = watch("images");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [countryValue, stateValue]
  );

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (detailedAddress && stateValue && countryValue) {
        const finalAddress = `${detailedAddress}, ${stateValue?.label}, ${countryValue?.label}`;
        const coords = await getCoordinates(finalAddress);
        setCoordinates(coords);
        setValue("latlng", coords);
      }
    };

    fetchCoordinates();
  }, [detailedAddress, stateValue, countryValue, setValue]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      if (step !== STEPS.HYPERLINK) {
        return onNext();
      }

      setIsLoading(true);

      axios
        .post("/api/restaurants/listings", data)
        .then(() => {
          toast.success("Restaurants created!");
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY);
          restaurantRentModal.onClose();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [router, setIsLoading, restaurantRentModal, reset, step]
  );

  const actionLabel = useMemo(() => {
    if (step === STEPS.HYPERLINK) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your restaurants?"
        subtitle="Pick a category"
      />
      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {restaurantCategories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(restaurantCategory) =>
                setCustomValue("category", restaurantCategory)
              }
              selected={restaurantCategory === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your restaurant located?"
          subtitle="Help guests find you!"
        />
        <InputLocation
          id="detailedAddress"
          label="Detailed Address"
          disabled={isLoading}
          value={detailedAddress}
          onChange={(e) => setDetailedAddress(e.target.value)}
          register={register}
          errors={errors}
          required
        />
        <CountrySelect
          value={country}
          onChange={(value) => {
            setCountry(value);
            setCustomValue("countryValue", value);
          }}
        />
        {country && (
          <StateSelect
            countryCode={country.value}
            value={state}
            onChange={(value) => {
              setState(value);
              setCustomValue("stateValue", value);
            }}
          />
        )}
        <Map center={coordinates} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your restaurant"
          subtitle="What amenities do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests do you allow?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your restaurant"
          subtitle="Show guests what your restaurant looks like!"
          subtitle2="Please choose more than 4 images for your restaurant &
                      The 1st image will be displayed in homepage."
        />
        <ImageUpload
          value={images.map((image: { url: string }) => image.url)}
          disabled={isLoading}
          onChange={(url) => setCustomValue("images", [...images, { url }])}
          onRemove={(url) =>
            setCustomValue("images", [
              ...images.filter(
                (current: { url: string }) => current.url !== url
              ),
            ])
          }
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your restaurant?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per meal?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }
  if (step === STEPS.CONTACT) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Stay Connected Anytime, Anywhere"
          subtitle="Share your contact details and let's keep the conversation going!"
        />
        <Input
          id="phoneContact"
          label="PhoneContact"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }
  if (step === STEPS.HYPERLINK) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Are you already have your own website?"
          subtitle="Feel free to add your link here !"
        />
        <Input
          id="hyperlink"
          label="Hyperlink"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // if (event.key === "Enter") {
      //   event.preventDefault();
      //   handleSubmit(onSubmit)();
      // }
      if (event.key === "Escape") {
        event.preventDefault();
        restaurantRentModal.onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit, restaurantRentModal]);

  return (
    <Modal
      disabled={isLoading}
      isOpen={restaurantRentModal.isOpen}
      title="VatiBnb your restaurant!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={restaurantRentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RestaurantRentModal;
