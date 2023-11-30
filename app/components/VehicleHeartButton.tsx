"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";
import useVehicleFavorite from "../hooks/useVehicleFavorite";

interface HeartButtonProps {
  vehicleId: string;
  currentUser?: SafeUser | null;
}

const VehicleHeartButton: React.FC<HeartButtonProps> = ({
  vehicleId,
  currentUser,
}) => {
  const { hasFavorited, toggleFavorite } = useVehicleFavorite({
    vehicleId,
    currentUser,
  });
  return (
    <div
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default VehicleHeartButton;
