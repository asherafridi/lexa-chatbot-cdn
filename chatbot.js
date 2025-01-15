document.addEventListener("DOMContentLoaded", () => {
    // Create and append the toggle button
    const toggleButton = document.createElement("button");
    toggleButton.id = "chatbot-toggle";
    toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    document.body.appendChild(toggleButton);
  
    // Create and append the chatbot container
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.innerHTML = `
      <div id="chatbot-header"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlXTd6FF5TBJbnQMU3SrwA3JAUMd3Ovu1lvw&s" />Annie Smith</div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input">
        <input type="text" placeholder="Type a message..." id="chatbot-text-input" />
        <button type="submit" id="chatbot-send-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg></button>
      </div>
    `;
    document.body.appendChild(chatbotContainer);
  
    // Toggle chatbot visibility on button click
    toggleButton.onclick = function () {
      if (chatbotContainer.style.display === "none") {
        chatbotContainer.style.display = "block";
        toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-x"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`; // Change button text to indicate close
      } else {
        chatbotContainer.style.display = "none";
        toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`; // Change back to open
      }
    };
  
    const input = chatbotContainer.querySelector("#chatbot-text-input");
    const messages = chatbotContainer.querySelector("#chatbot-messages");
  
    // Function to add a message to the chatbot
    function addMessage(content, sender = "You") {
      const message = document.createElement("div");
      message.className = `${sender === "Bot" ? "bot-message" : "user-message"}`;
      message.innerHTML = `<span>${content}</span> ${sender}`;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }
  
    // Fetch user ID from script URL
    function getUserIdFromScript() {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].getAttribute("src");
        if (src && src.includes("chatbot.js")) {
          const fullUrl = new URL(src, window.location.origin);
          return fullUrl.searchParams.get("id");
        }
      }
      return null;
    }
  
    const userId = getUserIdFromScript();
  
    // Function to fetch bot response
    async function getBotResponse(userInput) {
      try {
        const response = await fetch("https://lexa-v2.vercel.app/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: userId, message: userInput })
        });
  
        if (!response.ok) throw new Error("Failed to fetch the response");
  
        const data = await response.json();
        return data.ans;
      } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Sorry, I am having trouble responding at the moment.";
      }
    }
  
    // Function to handle sending the user message
    async function handleSendMessage() {
      const userText = input.value.trim();
      if (userText) {
        addMessage(userText, "You");
        input.value = "";

        const botResponse = await getBotResponse(userText);
        addMessage(botResponse, "Bot");
      }
    }

    // Add event listener for the send button
    const sendButton = chatbotContainer.querySelector("#chatbot-send-button");
    sendButton.onclick = handleSendMessage;

    // Trigger send on Enter key press
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    });
  });
