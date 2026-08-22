export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: "No prompt provided"
            });
        }

        const response = await fetch(
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
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI API Error:", data);

            return res.status(response.status).json({
                error: "OpenAI API request failed"
            });
        }

        return res.status(200).json({
            answer: data.output_text
        });

    } catch (error) {

        console.error("Server Error:", error);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}
