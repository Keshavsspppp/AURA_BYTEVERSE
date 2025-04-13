import React, { useState, useEffect, useRef } from "react";

// Configure backend URL (use Vite environment variable or fallback)
const BACKEND_URL = "http://localhost:8000";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm here to listen and support you. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(null); // Tracks index of message being spoken
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition (if supported)
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Sorry, I couldn't understand your speech. Please try again or type your message." },
        ]);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSpeechInput = () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Speech recognition is not supported in this browser." },
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakResponse = (text, messageIndex) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking === messageIndex) {
        // Stop speaking if the same message's button is clicked
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
      } else {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.onend = () => {
          setIsSpeaking(null); // Reset when speech finishes
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(messageIndex);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Text-to-speech is not supported in this browser." },
      ]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log(`Sending request to ${BACKEND_URL}/chat with message: ${input}`);  // Debug
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);  // Debug

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.response || "No response received." },
        ]);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `Sorry, I couldn't connect to the server at ${BACKEND_URL}. Please ensure the backend is running on port 8000.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 container mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg flex items-center space-x-2 ${
                    msg.role === "user"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <span>{msg.content}</span>
                  {msg.role === "bot" && (
                    <button
                      onClick={() => speakResponse(msg.content, index)}
                      className="p-1 hover:bg-gray-300 rounded-full"
                      title={isSpeaking === index ? "Stop speaking" : "Speak response"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        {isSpeaking === index ? (
                          <path d="M6 6h12v12H6z" />
                        ) : (
                          <path d="M3 9v6h4l5 5V4l-5 5H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        )}
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isLoading || isListening}
            />
            <button
              type="button"
              onClick={handleSpeechInput}
              disabled={isLoading}
              className={`p-3 rounded-lg transition-colors ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white disabled:opacity-50`}
              title={isListening ? "Stop listening" : "Speak"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {isListening ? (
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                ) : (
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.97 5.36 5.91 5.86V20h-2c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2.14c2.94-.5 5.42-2.86 5.91-5.86.09-.60-.39-1.14-1-1.14z" />
                )}
              </svg>
            </button>
            <button
              type="submit"
              disabled={isLoading || isListening}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;