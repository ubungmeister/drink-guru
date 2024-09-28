import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ content: "Unauthorized" });
    return;
  }

  if (req.method === "POST") {
    const { id, name, image } = req.body.drink;
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
    // If the drink exists but isn't saved by the user, save it
    await prisma.userCocktail.create({
      data: {
        userId: session.user.id,
        cocktailId: drink.id,
      },
    });
    return res.status(201).json({ content: "Drink created and saved" });
  }
  //get the saved drink by ID for a certain user
  if (req.method === "GET") {
    // Fetch all saved drinks for the user
    const savedDrinks = await prisma.userCocktail.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        cocktail: true,
      },
    });

    return res.status(200).json({ content: "All saved drinks", savedDrinks });
  }

  if (req.method === "DELETE") {
    const { id } = req.body.drink;

    if (!id) {
      return res.status(400).json({ message: "No coctail ID provided" });
    }

    const savedDrink = await prisma.userCocktail.findFirst({
      where: {
        userId: session.user.id,
        cocktailId: id,
      },
    });

    if (!savedDrink) {
      return res.status(400).end(`Couldn't find drink in saved`);
    }

    await prisma.userCocktail.delete({
      where: {
        id: savedDrink.id,
      },
    });

    return res.status(200).json({ message: "Drink deleted successfully" });
  } else {
    res.status(400).end(`Eror`);
  }
}
