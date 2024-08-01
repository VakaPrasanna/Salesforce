let conversation = [
    {
        role: "system",
        content:
            "you are a python instructor ",
    },
];

async function sendPrompt() {
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value.trim();

    if (prompt !== "") {
        conversation.push({ role: "user", content: prompt });

        try {
            // Add thinking message
            addMessage("thinking", "I'm thinking..., please wait...");

            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                "https://api.openai.com/v1/chat/completions",
                true
            );
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader(
                "Authorization",
                "Bearer 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"
            );

            xhr.onreadystatechange = function () {
                if (
                    xhr.readyState === XMLHttpRequest.DONE &&
                    xhr.status === 200
                ) {
                    const apiResponse = JSON.parse(xhr.responseText);
                    const aiMessage = apiResponse.choices[0].message.content;
                    conversation.push({
                        role: "assistant",
                        content: aiMessage,
                    });

                    // Remove thinking message
                    const thinkingMessage = document.getElementsByClassName(
                        "thinking"
                    )[0];
                    thinkingMessage.parentNode.removeChild(thinkingMessage);

                    // Append the AI's message to the chat container
                    addMessage("received", aiMessage);
                }
            };

            xhr.send(
                JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: conversation,
                    max_tokens: 2000,
                    temperature: 0,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0.5,
                })
            );

            // Append the user's message to the chat container
            addMessage("sent", prompt);

            // Clear the input box
            promptInput.value = "";
        } catch (error) {
            console.error("Error in sendPrompt:", error);
        }
    }
}




// ============================= NEW SCRIPT =================

function addMessage(type, text) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add(type);
    messageContainer.classList.add("message");

    const senderName = document.createElement("h6");
    senderName.classList.add("mb-1");
    senderName.classList.add("bot-title");
    senderName.innerText = "";
    senderName.style.marginLeft = type == "received" ? "60px !important" : "0";

    const messageBody = document.createElement("div");
    messageBody.classList.add(
        type == "received" ? "received_withd_msg" : "sent_msg"
    );

    const messageText = document.createElement("p");
    messageText.innerText = text;

    messageBody.appendChild(messageText);

    const imageTextContainer = document.createElement("div");
    imageTextContainer.classList.add("imageText");

    if (type == "received") {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("incoming_msg_img");

        const image = document.createElement("img");
        image.src = "./assets/chatbot.png";
        image.alt = "agentpic";

        imageContainer.appendChild(image);
        imageTextContainer.appendChild(imageContainer);
    }

    imageTextContainer.appendChild(messageBody);

    messageContainer.appendChild(senderName);
    messageContainer.appendChild(imageTextContainer);

    document.getElementById("chat-body").appendChild(messageContainer);
    scrollToBottom();
}

// ====================================================

function scrollToBottom() {
    const chatBody = document.getElementById("chat-body");
    chatBody.scrollTop = chatBody.scrollHeight;
}

document.getElementById("send-button").addEventListener("click", sendPrompt);

document.getElementById("prompt").addEventListener("keyup", function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        sendPrompt();
    }
});

function resetChat() {
    document.getElementById("chat-body").innerHTML = "";
}
