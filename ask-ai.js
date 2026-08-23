// ==========================================
// STUDYMIND AI - AI CONNECTION
// ==========================================

async function askAI(prompt) {

    try {

        console.log("Sending prompt to StudyMind AI...");

        const response = await fetch("/api", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt
            })

        });


        // Try to read the response
        const data = await response.json();


        console.log("AI server response:", data);


        // If the server returned an error
        if (!response.ok) {

            console.error(
                "AI server error:",
                data
            );

            throw new Error(
                data.error ||
                `AI request failed (${response.status})`
            );

        }


        // Make sure we actually received an answer
        if (!data.answer) {

            throw new Error(
                "The AI server returned no answer."
            );

        }


        return data.answer;


    } catch (error) {

        console.error(
            "StudyMind AI connection error:",
            error
        );


        return `
            <div class="ai-error">

                <strong>
                    ⚠️ StudyMind AI couldn't respond.
                </strong>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

    }

}
