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


        // Call OpenAI
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


        // Get OpenAI response
        const data =
            await openAIResponse.json();


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


        // Get generated text
        const answer =
            data.output_text;


        if (!answer) {

            console.error(
                "No output_text returned:",
                data
            );

            return res.status(500).json({
                error:
                    "OpenAI returned an empty response."
            });

        }


        // Send answer back to browser
        return res.status(200).json({

            answer: answer

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
