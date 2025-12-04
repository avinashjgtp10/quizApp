// 1. Import Dependencies
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");

// 2. Configure the App and AI Model
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.get("/", (req, res) => {
  res.send("Welcome to the Course Recommendation API!");
});

// 3. Define the API Endpoint
app.post("/recommendations", async (req, res) => {
  // a. Get user answers from the request body
  const data = req.body;


  const prompt = `
        You are an expert career counselor and course recommender for the tech industry.
        Based on the user's answers to the following questionnaire, please recommend 3 specific online courses.

        User's Answers:
        ---
        ${data}
        ---

        Your task:
        1. Analyze the user's interests, experience level, and goals from their answers.
        2. Recommend 3 distinct courses that would be a great fit for them.
        3. For each recommendation, provide a title, a brief description, and a reason why it's a good fit based on their specific answers.

        IMPORTANT: Your final response MUST be a valid JSON object. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object. The JSON object should have a single key "recommendations" which is an array of objects. Each object in the array must have three string keys:   id: number
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  rating: number
  students: number
  price: string in inr ex rs 999
  tags: string[]
  image: string.
    `;

  try {
    // d. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // e. Parse the JSON response from Gemini
    // We wrap this in a try-catch in case the model returns non-JSON text
    try {
      const responseTextData = responseText.replace(/^\s*```json/, "").replace(/```$/, "").trim();
      const parsedJson = JSON.parse(responseTextData);
      // f. Send the successful response back to the client
      res.status(200).json(parsedJson);
    } catch (jsonError) {
      console.error("Error parsing JSON from Gemini:", responseText);
      res
        .status(500)
        .json({
          error: "Failed to parse recommendation data from the AI model.",
        });
    }
  } catch (error) {
    // g. Handle errors from the Gemini API
    console.error("Error calling Gemini API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching recommendations." });
  }
});

// 4. Start the Server
app.listen(port, () => {
  console.log(
    `Course recommendation server is running on http://localhost:${port}`
  );
});
