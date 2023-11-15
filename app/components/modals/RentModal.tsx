"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import useRentModal from "@/app/hooks/useRentModal";

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import StateSelect, { StateSelectValue } from "../inputs/StateSelect";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { getCoordinates } from "@/app/libs/coordinate";
import InputLocation from "../inputs/Input-location";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
  HYPERLINK = 6,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

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
      roomCount: 1,
      bathroomCount: 1,
      images: [],
      price: 1,
      title: "",
      description: "",
      hyperlink: "",
    },
  });

  const countryValue = watch("countryValue");
  const stateValue = watch("stateValue");
  const category = watch("category");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
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
        .post("/api/listings", data)
        .then(() => {
          toast.success("Listing created!");
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [router, setIsLoading, rentModal, reset, step]
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
        title="Which of these best describes your place?"
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
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
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
          title="Where is your place located?"
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
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("roomCount", value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
          subtitle2="Please choose more than 4 images for your place &
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
          title="How would you describe your place?"
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
          subtitle="How much do you charge per night?"
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
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit(onSubmit)();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        rentModal.onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit, rentModal]);

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="VatiBnb your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
