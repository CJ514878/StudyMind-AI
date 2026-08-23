```js
module.exports = async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        // Check that the API key exists
        if (!process.env.OPENAI_API_KEY) {

            console.error("OPENAI_API_KEY is missing.");

            return res.status(500).json({
                error: "OPENAI_API_KEY is not configured on Vercel."
            });
        }

        // Get prompt from request
        const { prompt } = req.body || {};

        if (!prompt || typeof prompt !== "string") {

            return res.status(400).json({
                error: "No valid prompt provided."
            });
        }

        // Call OpenAI Responses API
        const openAIResponse = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({

                    model: "gpt-5-mini",

                    instructions:
                        "You are StudyMind AI, a helpful and encouraging AI study coach. Help students understand their study plans, subjects, topics, revision strategies, exam preparation, and time management. Give clear, practical, age-appropriate educational advice.",

                    input: prompt

                })
            }
        );

        // Read OpenAI response
        const data = await openAIResponse.json();

        console.log("OpenAI response status:", openAIResponse.status);

        // Handle OpenAI errors
        if (!openAIResponse.ok) {

            console.error(
                "OpenAI API Error:",
                data
            );

            return res.status(
                openAIResponse.status
            ).json({

                error:
                    data?.error?.message ||
                    "OpenAI API request failed."

            });
        }

        // Extract the assistant's text response
        let answer = "";

        if (data.output && Array.isArray(data.output)) {

            for (const item of data.output) {

                if (
                    item.type === "message" &&
                    Array.isArray(item.content)
                ) {

                    for (const content of item.content) {

                        if (
                            content.type === "output_text" &&
                            typeof content.text === "string"
                        ) {

                            answer += content.text;

                        }

                    }

                }

            }

        }

        // Fallback in case output_text exists directly
        if (!answer && typeof data.output_text === "string") {
            answer = data.output_text;
        }

        // Make sure we actually received text
        if (!answer.trim()) {

            console.error(
                "No text could be extracted from OpenAI response:",
                data
            );

            return res.status(500).json({
                error:
                    "OpenAI returned a response, but no text could be extracted."
            });

        }

        // Send answer back to browser
        return res.status(200).json({

            answer: answer.trim()

        });

    } catch (error) {

        console.error(
            "StudyMind AI Server Error:",
            error
        );

        return res.status(500).json({

            error:
                error.message ||
                "Something went wrong while connecting to the AI."

        });

    }

};
```
