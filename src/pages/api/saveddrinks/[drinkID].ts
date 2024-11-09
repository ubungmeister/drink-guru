import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { dataFilter } from "@utilities/datafilter";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// This API route is used to fetch a specific cocktail saved by the user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ content: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { drinkID } = req.query;

    // If drinkID is missing, return an error
    if (!drinkID) {
      return res.status(400).json({ content: "Cocktail ID is required" });
    }

    // Fetch the specific cocktail saved by the user
    const savedDrink = await prisma.userCocktail.findFirst({
      where: {
        userId: session.user.id,
        cocktailId: drinkID as string,
      },
      include: {
        cocktail: true,
      },
    });

     if (savedDrink) {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`,
      );
      const data = await response.json();
      const filteredData = dataFilter(data.drinks[0]);

      return res
        .status(200)
        .json({ content: "Cocktail found", savedDrink, filteredData });
    } else {
      return res.status(404).json({ content: "Cocktail not saved" });
    }
  } else {
    return res.status(405).json({ content: "Method Not Allowed" });
  }
}
