import {
  Image,
  Listing,
  Reservation,
  Restaurant,
  RestaurantImage,
  RestaurantReservation,
  User,
  Vehicle,
  VehicleImage,
  VehicleReservation,
} from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt" | "images"> & {
  createdAt: string;
  images: SafeImage[];
};

export type SafeImage = Omit<Image, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};
export type SafeVehicle = Omit<Vehicle, "createdAt" | "images"> & {
  createdAt: string;
  images: SafeVehicleImage[];
};

export type SafeVehicleImage = Omit<VehicleImage, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeVehicleReservation = Omit<
  VehicleReservation,
  "createdAt" | "startDate" | "endDate" | "vehicle"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  vehicle: SafeVehicle;
};
export type SafeRestaurant = Omit<Restaurant, "createdAt" | "images"> & {
  createdAt: string;
  images: SafeRestaurantImage[];
};

export type SafeRestaurantImage = Omit<
  RestaurantImage,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeRestaurantReservation = Omit<
  RestaurantReservation,
  "createdAt" | "startDate" | "endDate" | "restaurant"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  restaurant: SafeRestaurant;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
