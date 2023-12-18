"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      setIsLoading(true);

      axios
        .post("api/register", data)
        .then(() => {
          loginModal.onOpen();
          registerModal.onClose();
        })
        .catch((error) => {
          toast.error("error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [loginModal, registerModal, setIsLoading]
  );

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // if (event.key === "Enter") {
      //   event.preventDefault();
      //   handleSubmit(onSubmit)();
      // }
      if (event.key === "Escape") {
        event.preventDefault();
        registerModal.onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit, registerModal]);

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to VatiBnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="flex flex-row items-center gap-3">
        <div className="w-full h-[1px] bg-neutral-200" />
        <div className="font-semibold text-neutral-500 text-xs">or</div>
        <div className="w-full h-[1px] bg-neutral-200" />
      </div>
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div
        className="
                text-neutral-500
                text-center
                mt-4
                font-light
            "
      >
        <div
          className="
          flex 
          flex-row 
          items-center 
          justify-center 
          gap-2
        "
        >
          <div>Already have an account?</div>
          <div
            onClick={onToggle}
            className="
                        text-neutral-800
                        cursor-pointer
                        hover:underline
                    "
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
