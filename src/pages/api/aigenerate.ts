import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { dataFilter } from "@utilities/datafilter";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not defined in the environment variables.",
      );
    }

    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });

    let cocktailFound = false;
    let outputjoined = "";

    while (!cocktailFound) {
      // Request cocktail name from AI
      const data = await req.body;
      const result = await model.generateContent(data);
      const output = result.response.text();

      // Convert to the  required format
      const outputsplitted = output.split(" ");
      outputjoined = outputsplitted.join("_");

      // Check if cocktail exists in the CocktailDB API
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${outputjoined}`,
        );
        const data = await response.json();

        if (response.ok && data.drinks) {
          cocktailFound = true; // Exit the loop

          if (data.drinks.length > 1) {
            //choose random cocktail
            const randomCoctail = Math.floor(
              Math.random() * data.drinks.length,
            );

            const filteredData = dataFilter(data.drinks[randomCoctail]);
            return res
              .status(StatusCodes.CREATED)
              .json({ output: filteredData });
          } else {
            const filteredData = dataFilter(data.drinks[0]);

            return res
              .status(StatusCodes.CREATED)
              .json({ output: filteredData });
          }
        } else {
          console.log("Cocktail not found, one more time...");
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: error.message });
      }
    }
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}
