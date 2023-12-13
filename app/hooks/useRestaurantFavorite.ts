import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  restaurantId: string;
  currentUser?: SafeUser | null;
}

const useRestaurantFavorite = ({ restaurantId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(restaurantId);
  }, [currentUser, restaurantId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () =>
            axios.delete(`/api/vehicles/favorites/${restaurantId}`);
        } else {
          request = () => axios.post(`/api/vehicles/favorites/${restaurantId}`);
        }

        await request();
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavorited, restaurantId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useRestaurantFavorite;
