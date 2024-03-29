import { Nunito } from "next/font/google";

import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import CarRentModal from "./components/modals/CarRentModal";
import VehicleSearchModal from "./components/modals/VehicleSearchModal";
import RestaurantRentModal from "./components/modals/RestaurantRentModal";
import RestaurantSearchModal from "./components/modals/RestaurantSearchModal";

export const metadata = {
  title: "VatiBnb",
  description: "VatiBnb your service!",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <VehicleSearchModal />
          <RestaurantSearchModal />
          <RentModal />
          <CarRentModal />
          <RestaurantRentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
