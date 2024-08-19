import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = await req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not defined in the environment variables.",
      );
    }

    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(data);
    const output = result.response.text();
    return res.status(StatusCodes.CREATED).json({ output });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}
