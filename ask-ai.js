/* =========================================================
   STUDYMIND AI — ASK AI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. ELEMENTS
       ========================================================= */

    const form =
        document.getElementById("askAIForm") ||
        document.getElementById("aiForm");

    const input =
        document.getElementById("aiQuestion") ||
        document.getElementById("questionInput") ||
        document.getElementById("userQuestion");

    const chatContainer =
        document.getElementById("chatContainer") ||
        document.getElementById("chatMessages") ||
        document.getElementById("aiResponse");

    const sendButton =
        document.getElementById("askAIButton") ||
        document.getElementById("sendAIButton") ||
        document.getElementById("sendButton");

    const clearButton =
        document.getElementById("clearChat");

    /* =========================================================
       2. SETTINGS
       ========================================================= */

    /*
       Your backend endpoint.

       If your Vercel API is located at:
       /api/index.js

       then /api/ask will be used.

       Change this only if your backend uses another route.
    */

    const API_URL = "/api/ask";


    /* =========================================================
       3. CHAT HISTORY
       ========================================================= */

    let chatHistory = [];

    try {

        const savedChat =
            JSON.parse(
                localStorage.getItem("studyMindChat") || "[]"
            );

        if (Array.isArray(savedChat)) {
            chatHistory = savedChat;
        }

    } catch (error) {

        console.warn(
            "Could not load previous chat.",
            error
        );

        chatHistory = [];
    }


    /* =========================================================
       4. INITIAL CHAT
       ========================================================= */

    renderChat();


    /* =========================================================
       5. FORM SUBMISSION
       ========================================================= */

    form?.addEventListener("submit", async (event) => {

        event.preventDefault();

        await sendQuestion();

    });


    /* =========================================================
       6. SEND BUTTON
       ========================================================= */

    sendButton?.addEventListener("click", async (event) => {

        /*
           If the button is inside a form,
           the form submit handler will handle it.
        */

        if (form) return;

        event.preventDefault();

        await sendQuestion();

    });


    /* =========================================================
       7. ENTER KEY
       ========================================================= */

    input?.addEventListener("keydown", async (event) => {

        /*
           Enter sends the question.
           Shift + Enter creates a new line.
        */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            await sendQuestion();
        }

    });


    /* =========================================================
       8. SEND QUESTION
       ========================================================= */

    async function sendQuestion() {

        if (!input) return;

        const question =
            input.value.trim();

        if (!question) return;

        /*
           Prevent multiple requests at once.
        */

        if (sendButton?.disabled) return;

        addMessage(
            "user",
            question
        );

        input.value = "";

        saveChat();

        setLoading(true);

        const loadingID =
            addLoadingMessage();

        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            question: question,
                            message: question,
                            history: chatHistory
                        })
                    }
                );


            /* =================================================
               CHECK SERVER RESPONSE
               ================================================= */

            let data = {};

            try {

                data = await response.json();

            } catch (error) {

                throw new Error(
                    "The server returned an invalid response."
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    `Request failed (${response.status}).`
                );
            }


            /* =================================================
               FIND AI RESPONSE
               ================================================= */

            const answer =
                data.answer ||
                data.response ||
                data.message ||
                data.reply ||
                data.text;


            if (!answer) {

                throw new Error(
                    "StudyMind AI did not return an answer."
                );
            }


            /* =================================================
               REMOVE LOADING
               ================================================= */

            removeLoadingMessage(
                loadingID
            );


            /* =================================================
               ADD AI RESPONSE
               ================================================= */

            addMessage(
                "ai",
                answer
            );

            saveChat();


        } catch (error) {

            console.error(
                "StudyMind AI error:",
                error
            );

            removeLoadingMessage(
                loadingID
            );

            addMessage(
                "ai",
                getFriendlyErrorMessage(error)
            );

            saveChat();

        } finally {

            setLoading(false);

            input.focus();
        }
    }


    /* =========================================================
       9. ADD MESSAGE
       ========================================================= */

    function addMessage(
        sender,
        text
    ) {

        const message = {

            sender:
                sender,

            text:
                String(text),

            timestamp:
                Date.now()
        };

        chatHistory.push(message);

        renderSingleMessage(
            message
        );

        scrollToBottom();
    }


    /* =========================================================
       10. RENDER CHAT
       ========================================================= */

    function renderChat() {

        if (!chatContainer) return;

        /*
           Keep any static welcome message if there
           is no saved conversation.
        */

        if (chatHistory.length === 0) {
            return;
        }

        chatContainer.innerHTML = "";

        chatHistory.forEach(message => {

            renderSingleMessage(
                message
            );
        });

        scrollToBottom();
    }


    /* =========================================================
       11. RENDER SINGLE MESSAGE
       ========================================================= */

    function renderSingleMessage(
        message
    ) {

        if (!chatContainer) return;

        const messageElement =
            document.createElement("div");

        messageElement.className =
            `chat-message ${message.sender}`;

        const isAI =
            message.sender === "ai";

        messageElement.innerHTML = `

            <div class="chat-avatar">
                ${isAI ? "🤖" : "👤"}
            </div>

            <div class="chat-bubble">

                <div class="chat-sender">
                    ${isAI ? "StudyMind AI" : "You"}
                </div>

                <div class="chat-text">
                    ${formatAIResponse(
                        message.text
                    )}
                </div>

            </div>
        `;

        chatContainer.appendChild(
            messageElement
        );
    }


    /* =========================================================
       12. FORMAT AI RESPONSE
       ========================================================= */

    function formatAIResponse(
        text
    ) {

        let safeText =
            escapeHTML(text);


        /*
           Convert basic Markdown-style formatting.
        */

        safeText =
            safeText.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            );


        safeText =
            safeText.replace(
                /\*(.*?)\*/g,
                "<em>$1</em>"
            );


        /*
           Convert numbered lists.
        */

        safeText =
            safeText.replace(
                /^(\d+)\.\s+(.*)$/gm,
                "<div class=\"ai-list-item\"><strong>$1.</strong> $2</div>"
            );


        /*
           Convert bullet points.
        */

        safeText =
            safeText.replace(
                /^[-•]\s+(.*)$/gm,
                "<div class=\"ai-list-item\">• $1</div>"
            );


        /*
           Preserve line breaks.
        */

        safeText =
            safeText.replace(
                /\n/g,
                "<br>"
            );


        return safeText;
    }


    /* =========================================================
       13. LOADING MESSAGE
       ========================================================= */

    function addLoadingMessage() {

        if (!chatContainer) {
            return null;
        }

        const id =
            `loading-${Date.now()}`;

        const loading =
            document.createElement("div");

        loading.id = id;

        loading.className =
            "chat-message ai loading-message";

        loading.innerHTML = `

            <div class="chat-avatar">
                🤖
            </div>

            <div class="chat-bubble">

                <div class="chat-sender">
                    StudyMind AI
                </div>

                <div class="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>
        `;

        chatContainer.appendChild(
            loading
        );

        scrollToBottom();

        return id;
    }


    /* =========================================================
       14. REMOVE LOADING MESSAGE
       ========================================================= */

    function removeLoadingMessage(
        id
    ) {

        if (!id) return;

        document
            .getElementById(id)
            ?.remove();
    }


    /* =========================================================
       15. LOADING STATE
       ========================================================= */

    function setLoading(
        loading
    ) {

        if (sendButton) {

            sendButton.disabled =
                loading;

            if (loading) {

                sendButton.dataset.originalText =
                    sendButton.textContent;

                sendButton.textContent =
                    "Thinking...";

            } else {

                sendButton.textContent =
                    sendButton.dataset.originalText ||
                    "Ask AI";
            }
        }

        if (input) {

            input.disabled =
                loading;
        }
    }


    /* =========================================================
       16. SAVE CHAT
       ========================================================= */

    function saveChat() {

        try {

            localStorage.setItem(
                "studyMindChat",
                JSON.stringify(
                    chatHistory
                )
            );

        } catch (error) {

            console.warn(
                "Could not save chat.",
                error
            );
        }
    }


    /* =========================================================
       17. CLEAR CHAT
       ========================================================= */

    clearButton?.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Clear your StudyMind AI conversation?"
                );

            if (!confirmed) return;

            chatHistory = [];

            localStorage.removeItem(
                "studyMindChat"
            );

            if (chatContainer) {

                chatContainer.innerHTML = "";
            }

        }
    );


    /* =========================================================
       18. SCROLL TO BOTTOM
       ========================================================= */

    function scrollToBottom() {

        if (!chatContainer) return;

        setTimeout(() => {

            chatContainer.scrollTop =
                chatContainer.scrollHeight;

        }, 50);
    }


    /* =========================================================
       19. FRIENDLY ERROR MESSAGES
       ========================================================= */

    function getFriendlyErrorMessage(
        error
    ) {

        const message =
            error?.message?.toLowerCase() || "";


        if (
            message.includes("failed to fetch") ||
            message.includes("network")
        ) {

            return `
                I couldn't connect to StudyMind AI right now.
                Please check your internet connection and try again.
            `;
        }


        if (
            message.includes("401") ||
            message.includes("403") ||
            message.includes("unauthorized")
        ) {

            return `
                StudyMind AI is not properly authorized yet.
                Please check the AI API configuration.
            `;
        }


        if (
            message.includes("429") ||
            message.includes("too many")
        ) {

            return `
                StudyMind AI is receiving too many requests right now.
                Please wait a moment and try again.
            `;
        }


        if (
            message.includes("500") ||
            message.includes("server")
        ) {

            return `
                Something went wrong on the StudyMind AI server.
                Please try again in a moment.
            `;
        }


        return `
            Sorry, I couldn't process that question right now.
            Please try again.
        `;
    }


    /* =========================================================
       20. ESCAPE HTML
       ========================================================= */

    function escapeHTML(
        value
    ) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* =========================================================
       21. PUBLIC FUNCTION
       ========================================================= */

    /*
       This allows other scripts to call:

       askStudyMindAI("Explain photosynthesis")
    */

    window.askStudyMindAI =
        async function(question) {

            if (!input) return;

            input.value =
                question;

            await sendQuestion();
        };


    /* =========================================================
       22. EXPOSE CHAT CLEAR FUNCTION
       ========================================================= */

    window.clearStudyMindChat =
        function() {

            chatHistory = [];

            localStorage.removeItem(
                "studyMindChat"
            );

            if (chatContainer) {

                chatContainer.innerHTML = "";
            }
        };


    /* =========================================================
       23. READY
       ========================================================= */

    console.log(
        "StudyMind AI assistant loaded successfully."
    );

});
