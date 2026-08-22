const askAI = async (prompt) => {
    try {
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI request failed");
        }

        return data.answer;

    } catch (error) {
        console.error("AI Error:", error);
        return "Sorry, I couldn't connect to the AI right now.";
    }
};
