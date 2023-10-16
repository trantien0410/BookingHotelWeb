import { Image, Listing, Reservation, User } from "@prisma/client";

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

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
