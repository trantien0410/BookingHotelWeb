"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { useCallback, useEffect, useRef, useState } from "react";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useCarRentModal from "@/app/hooks/useCarRentModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const CarUserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const carRentModal = useCarRentModal();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onCarRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    carRentModal.onOpen();
  }, [loginModal, carRentModal, currentUser]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    [menuRef]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onCarRent}
          className="
            hidden
            md:block
            text-sm
            font-bold
            py-3
            px-4
            rounded-full
            hover:bg-neutral-100
            text-neutral-800
            transition
            cursor-pointer
            whitespace-nowrap
          "
        >
          VatiBnb your vehicle
        </div>

        <div
          onClick={toggleOpen}
          className={`
                        p-4
                        md:p-1.5
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        hover:drop-shadow
                        bg-white
                        ${isOpen ? "drop-shadow" : ""}
                        transition
                    `}
        >
          <AiOutlineMenu className="md:ml-2" />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            mt-3
            absolute
            rounded-xl
            drop-shadow-xl
            ring-4
            ring-gray-100
            ring-opacity-30
            w-[40vw]
            md:w-[28vw]
            bg-white
            overflow-hidden
            right-0
            text-sm
            py-2
            max-w-[16rem]
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push("/cars/rentalVehicles")}
                  label="My rental vehicles"
                  isBold
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="My favorites"
                  isBold
                />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="My reservations"
                  isBold
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="My vehicles"
                  isBold
                />
                <div className="my-2 bg-neutral-200 w-full h-[1px]" />
                <MenuItem
                  onClick={carRentModal.onOpen}
                  label="VatiBnb your car"
                />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem
                  onClick={registerModal.onOpen}
                  label="Sign Up"
                  isBold
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarUserMenu;
