"use client";

import { usePathname } from "next/navigation";
import Container from "../Container";
import { MainNav } from "../MainNav";
import Categories from "./Categories";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";
import CarCategories from "./CarCategories";
import CarUserMenu from "./CarUserMenu";
import VehicleSearch from "./VehicleSearch";
import RestaurantCategories from "./RestaurantCategories";
import RestaurantUserMenu from "./RestaurantUserMenu";
import RestaurantSearch from "./RestaurantSearch";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const isCarsPage = pathname?.startsWith("/cars");
  const isRestaurantsPage = pathname?.startsWith("/restaurants");
  return (
    <>
      {isCarsPage ? (
        <div className="fixed w-full bg-white z-10 shadow-sm">
          <div
            className="
        py-4 
        border-b-[1px]
        max-h-[85px]
        "
          >
            <Container>
              <div className="flex h-16 items-center px-4">
                <Logo />
                <MainNav className="mx-10" />
                <div className="ml-auto flex items-center space-x-4">
                  <VehicleSearch />
                  <CarUserMenu currentUser={currentUser} />
                </div>
              </div>
            </Container>
          </div>
          <CarCategories />
        </div>
      ) : isRestaurantsPage ? (
        <div className="fixed w-full bg-white z-10 shadow-sm">
          <div
            className="
        py-4 
        border-b-[1px]
        max-h-[85px]
        "
          >
            <Container>
              <div className="flex h-16 items-center px-4">
                <Logo />
                <MainNav className="mx-10" />
                <div className="ml-auto flex items-center space-x-4">
                  <RestaurantSearch />
                  <RestaurantUserMenu currentUser={currentUser} />
                </div>
              </div>
            </Container>
          </div>
          <RestaurantCategories />
        </div>
      ) : (
        <div className="fixed w-full bg-white z-10 shadow-sm">
          <div
            className="
        py-4 
        border-b-[1px]
        max-h-[85px]
        "
          >
            <Container>
              <div className="flex h-16 items-center px-4">
                <Logo />
                <MainNav className="mx-10" />
                <div className="ml-auto flex items-center space-x-4">
                  <Search />
                  <UserMenu currentUser={currentUser} />
                </div>
              </div>
            </Container>
          </div>
          <Categories />
        </div>
      )}
    </>
  );
};

export default Navbar;
