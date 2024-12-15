import { dataFilter } from "@utilities/datafilter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

      // Convert to the required format
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

          let selectedDrink;

          if (data.drinks.length > 1) {
            // Choose a random cocktail
            const randomCocktail = Math.floor(
              Math.random() * data.drinks.length,
            );
            selectedDrink = data.drinks[randomCocktail];
          } else {
            selectedDrink = data.drinks[0];
          }

          // Filter the data
          const filteredData = dataFilter(selectedDrink);

          // Check if the cocktail exists in the database
          const existingCocktail = await prisma.cocktail.findUnique({
            where: { id: filteredData.id },
            include: {
              CocktailMetric: true,
            },
          });

          let cocktailMetrics;

          if (!existingCocktail) {
            // Create the cocktail in the database
            const createdCocktail = await prisma.cocktail.create({
              data: {
                id: filteredData.id,
                name: filteredData.name,
                image: filteredData.image,
              },
            });

            console.log("createdCocktail", createdCocktail);

            // Retry logic for fetching and validating metrics
            const parsedMetrics = await fetchAndValidateMetrics(
              model,
              filteredData,
            );

            console.log("parsedMetrics", parsedMetrics);

            cocktailMetrics = await prisma.cocktailMetric.create({
              data: {
                cocktailId: createdCocktail.id,
                sweetness: parsedMetrics.sweetness,
                sourness: parsedMetrics.sourness,
                alcoholStrength: parsedMetrics.alcoholStrength,
                bitterness: parsedMetrics.bitterness,
                timeToMake: parsedMetrics.timeToMake,
                rating: parsedMetrics.rating,
              },
            });
          } else {
            // If the cocktail exists, use its existing metrics
            cocktailMetrics = await prisma.cocktailMetric.findFirst({
              where: { cocktailId: filteredData.id },
            });
          }

          return res.status(StatusCodes.CREATED).json({
            cocktail: filteredData,
            metrics: cocktailMetrics,
          });
        } else {
          console.log("Cocktail not found, trying again...");
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

// Helper function for fetching and validating metrics
const MAX_RETRIES = 3;

async function fetchAndValidateMetrics(model: any, filteredData: any) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    retries += 1;

    console.log(`Attempt ${retries}: Requesting metrics from AI...`);

    const metricResponse = await model.generateContent([
      `Evaluate the following cocktail metrics for the cocktail "${filteredData.name}": sweetness, sourness, alcohol strength, bitterness, time (in minutes) to make, and rating. Use the ingredients provided: ${JSON.stringify(
        filteredData.ingredients,
      )}.
      
      - Output MUST strictly follow this format: sweetness:0-5, sourness:0-5, alcoholStrength:0-5, bitterness:0-5, timeToMake:0-x, rating:0-5.
      - Each metric must be a single numeric value (e.g., sweetness:4, sourness:3).
      - Do not provide ranges or additional explanations.
    
      Example output:
      sweetness:4, sourness:3, alcoholStrength:5, bitterness:2, timeToMake:10, rating:4.
      `,
    ]);

    const metricOutput = metricResponse.response.text();

    // Split the string by ", " to get individual metrics
    const parsedMetrics = Object.fromEntries(
      metricOutput.split(", ").map((metric: any) => {
        const [key, value] = metric.split(":");
        return [key.trim(), parseFloat(value)];
      }),
    );

    console.log("Parsed Metrics:", parsedMetrics);

    if (validateMetrics(parsedMetrics)) {
      return parsedMetrics; // Metrics are valid, return them
    }

    console.warn("Validation failed. Retrying...");
  }

  throw new Error("Failed to fetch valid metrics after maximum retries.");
}

// Validation function
function validateMetrics(metrics: any) {
  const requiredKeys = [
    "sweetness",
    "sourness",
    "alcoholStrength",
    "bitterness",
    "timeToMake",
    "rating",
  ];

  // Check all required keys are present and have valid numeric values
  for (const key of requiredKeys) {
    const value = metrics[key];

    if (
      value === undefined || // Missing key
      value === null || // Null value
      isNaN(value) || // Not a number
      (key !== "timeToMake" && (value < 0 || value > 5)) || // Out of range for 0-5 metrics
      (key === "timeToMake" && value < 0) // Negative timeToMake
    ) {
      console.error(`Invalid value for ${key}: ${value}`);
      return false; // Validation failed
    }
  }

  return true; // Validation passed
}
