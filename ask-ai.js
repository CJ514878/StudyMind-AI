// ==========================================
// STUDYMIND AI - AI CONNECTION
// ==========================================

async function askAI(prompt) {

    try {

        console.log("Sending request to StudyMind AI...");


        const response = await fetch(
            "/api",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    prompt: prompt

                })

            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "AI server error:",
                data
            );

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        if (!data.answer) {

            throw new Error(
                "The AI returned no answer."
            );

        }


        console.log(
            "StudyMind AI connected successfully."
        );


        return data.answer;

    }


    catch (error) {

        console.error(
            "StudyMind AI Error:",
            error
        );


        return null;

    }

}
