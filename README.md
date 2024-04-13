<h1 align="center">:blush: A Service for Online Hotel Reservation and Management System :100:</h1>

<h2 align="center">By Tran Van Tien</h2>

<h2 align="center">VatiBnb
    <img src="./images/Logo10.png" width="36"/>
</h2>

## Getting Started

### Prerequisites

**Node version 20.x**

### Cloning the repository

```shell
git clone https://github.com/trantien0410/BookingHotelWeb.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL=
NEXTAUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_API_KEY=
FRONTEND_STORE_URL=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_OPENCAGE_API_KEY=
```

- For Database url, we can get it from MongoDB
- For NextAuth Secret, key we can use like NEXTAUTH_SECRET
- For Github Id and Github Secret, we have to access to [Github](https://github.com/) and then find developer setting for OAuth Setting.
- For Google Client Id and Google Client Secret, we have to access to [Google Cloud console](https://cloud.google.com/) and then find API gateway for OAuth Setting.
- For Cloudinary Name, we have to access to [Cloudinary](https://cloudinary.com/) and choose developer for setting.
- For Frontend store url, this is the localhost of this project.
- For Stripe API key and Stripe webhook secret, we have to access to [Stripe](https://dashboard.stripe.com/) and then try to setup with some basic steps by following the instructions of Stripe to settings.
- For OpenCage API key, we have to access the [OpenCage](https://opencagedata.com/api) then find the Geocoding API for generating the API key.

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
