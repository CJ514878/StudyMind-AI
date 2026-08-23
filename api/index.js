export default async function handler(req, res) {

    // ==========================================
    // ONLY ALLOW POST REQUESTS
    // ==========================================

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    try {

        // ==========================================
        // GET PROMPT
        // ==========================================

        const { prompt } = req.body || {};


        if (!prompt) {

            return res.status(400).json({
                error: "No prompt provided"
            });

        }


        // ==========================================
        // CHECK API KEY
        // ==========================================

        if (!process.env.OPENAI_API_KEY) {

            console.error(
                "OPENAI_API_KEY is missing."
            );

            return res.status(500).json({
                error: "OPENAI_API_KEY is not configured."
            });

        }


        // ==========================================
        // OPENAI REQUEST
        // ==========================================

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`

                },

                body: JSON.stringify({

                    model: "gpt-5-mini",

                    input: prompt

                })

            }
        );


        // ==========================================
        // READ RESPONSE
        // ==========================================

        const data =
            await response.json();


        // ==========================================
        // HANDLE OPENAI ERROR
        // ==========================================

        if (!response.ok) {

            console.error(
                "OpenAI API Error:",
                data
            );

            return res.status(
                response.status
            ).json({

                error:
                    data?.error?.message ||
                    "OpenAI API request failed."

            });

        }


        // ==========================================
        // GET AI TEXT
        // ==========================================

        let answer =
            data.output_text;


        /*
        Some Responses API responses can expose
        the text through the output structure.
        This provides a fallback.
        */

        if (!answer && Array.isArray(data.output)) {

            answer =
                data.output
                    .flatMap(item =>
                        item.content || []
                    )
                    .filter(item =>
                        item.type === "output_text"
                    )
                    .map(item =>
                        item.text
                    )
                    .join("\n");

        }


        if (!answer) {

            console.error(
                "No AI text returned:",
                data
            );

            return res.status(500).json({

                error:
                    "The AI returned an empty response."

            });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            answer: answer

        });

    }


    catch (error) {

        console.error(
            "Server Error:",
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                "Something went wrong."

        });

    }

}
