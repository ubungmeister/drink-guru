import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const drinkSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: z.string().url().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ content: "Unauthorized" });
    }

    switch (req.method) {
      case "POST":
        return await handlePost(req, res, session);
      case "GET":
        return await handleGet(req, res, session);
      case "DELETE":
        return await handleDelete(req, res, session);
      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({ content: "Internal Server Error" });
  }
}

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
) => {
  console.log("here");
  try {
    console.log("req.body.drink", req.body.drink);
    const parsedData = drinkSchema.safeParse(req.body.drink);

    console.log("parsedData", parsedData);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid drink data",
        errors: parsedData.error.errors,
      });
    }

    const { id, name, image } = parsedData.data;

    let drink = await prisma.cocktail.findUnique({
      where: { id },
    });

    if (!drink) {
      drink = await prisma.cocktail.create({
        data: {
          id,
          name,
          image,
        },
      });
    }

    const userCocktail = await prisma.userCocktail.upsert({
      where: {
        userId_cocktailId: {
          userId: session.user.id,
          cocktailId: drink.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        cocktailId: drink.id,
      },
    });

    if (userCocktail) {
      return res.status(201).json({ content: "Drink saved successfully" });
    }

    return res.status(200).json({ content: "Drink already saved" });
  } catch (error) {
    console.error("POST Error:", error);
    return res.status(500).json({ content: "Internal Server Error" });
  }
};

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
) => {
  try {
    const savedDrinks = await prisma.userCocktail.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        cocktail: true,
      },
    });
    console.log("savedDrinks", savedDrinks);
    return res.status(200).json({ content: "All saved drinks", savedDrinks });
  } catch (error) {
    console.error("GET Error:", error);
    return res.status(500).json({ content: "Internal Server Error" });
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
) => {
  try {
    const { id } = req.body.drink;

    if (!id) {
      return res.status(400).json({ message: "No cocktail ID provided" });
    }

    const savedDrink = await prisma.userCocktail.findFirst({
      where: {
        userId: session.user.id,
        cocktailId: id,
      },
    });

    if (!savedDrink) {
      return res.status(400).json({ message: "Couldn't find drink in saved" });
    }

    await prisma.userCocktail.delete({
      where: {
        id: savedDrink.id,
      },
    });

    return res.status(200).json({ message: "Drink deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return res.status(500).json({ content: "Internal Server Error" });
  }
};
