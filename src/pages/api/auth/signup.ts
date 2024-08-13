import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

type signUpForm = {
  email: string;
  password: string;
  name: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { email, password, name } = req.body as signUpForm;

    //check if user exist
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUserWithEmail) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = (await bcrypt.hash(password, 10)) as string;

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return res.status(StatusCodes.CREATED).json({ message: "User created" });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: "Method not allowed" });
  }
}
