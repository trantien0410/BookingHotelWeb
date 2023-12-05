export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites",
    "/cars/rentalVehicles",
    "/cars/reservations",
    "/cars/properties",
    "/cars/favorites",
  ],
};
