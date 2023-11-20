import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: Role.USER,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
