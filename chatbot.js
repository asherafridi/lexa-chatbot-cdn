document.addEventListener("DOMContentLoaded", () => {
    // Create and append the toggle button
    const toggleButton = document.createElement("button");
    toggleButton.id = "chatbot-toggle";
    toggleButton.textContent = "+";
    document.body.appendChild(toggleButton);
  
    // Create and append the chatbot container
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.innerHTML = `
      <div id="chatbot-header">Chatbot</div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input">
        <input type="text" placeholder="Type a message..." id="chatbot-text-input" />
        <button type="submit" id="chatbot-send-button">Send</button>
      </div>
    `;
    document.body.appendChild(chatbotContainer);
  
    // Toggle chatbot visibility on button click
    toggleButton.onclick = function () {
      if (chatbotContainer.style.display === "none") {
        chatbotContainer.style.display = "block";
        toggleButton.textContent = "x"; // Change button text to indicate close
      } else {
        chatbotContainer.style.display = "none";
        toggleButton.textContent = "+"; // Change back to open
      }
    };
  
    const input = chatbotContainer.querySelector("#chatbot-text-input");
    const messages = chatbotContainer.querySelector("#chatbot-messages");
  
    // Function to add a message to the chatbot
    function addMessage(content, sender = "You") {
      const message = document.createElement("div");
      message.className = sender === "Bot" ? "bot-message" : "user-message";
      message.textContent = `${sender}: ${content}`;
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
        const response = await fetch("http://localhost:3000/api/chatbot", {
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
