import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { id, name, image } = req.body.drink;
    console.log("req.body", req.body);
    console.log("name", name);
    const session = await getServerSession(req, res, authOptions);
    console.log("session", session);
    if (!session) {
      res.status(401).json({ content: "Unauthorized" });
      return;
    }
    //first look for a drink, if it doesn't exist, create it
    //then check if the user already have this drink, and if not add this drink to the users saved drinks
    const drink = await prisma.cocktail.findFirst({
      where: {
        id,
      },
    });

    if (!drink) {
      // If the drink doesn't exist, create it and associate with the user
      await prisma.$transaction(async (tx) => {
        const newDrink = await tx.cocktail.create({
          data: {
            id,
            name,
            image,
          },
        });

        await tx.userCocktail.create({
          data: {
            userId: session.user.id,
            cocktailId: newDrink.id,
          },
        });
      });
      return res.status(201).json({ content: "Drink created and saved" });
    }
    // If the drink exists, check if it's already saved by the user
    const savedDrink = await prisma.userCocktail.findFirst({
      where: {
        userId: session.user.id,
        cocktailId: drink.id,
      },
    });

    if (savedDrink) {
      // If the drink is already saved, return the message
      return res.status(200).json({ content: "Drink already saved" });
    }

    // If the drink exists but isn't saved by the user, save it
    await prisma.userCocktail.create({
      data: {
        userId: session.user.id,
        cocktailId: drink.id,
      },
    });
  }
}
