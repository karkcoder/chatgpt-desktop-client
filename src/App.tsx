import { useState, useEffect, useRef } from "react";
import { chatGPTService } from "./chatgpt-service";
import { secureStorage } from "./storage";
import "./App.css";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  hasApiKey: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    hasApiKey: false,
  });
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for stored API key on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check environment variable
        const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (envApiKey && envApiKey !== "your_openai_api_key_here") {
          setApiKey(envApiKey);
          await chatGPTService.setApiKey(envApiKey, false); // Don't save env key
          setAuthState({ isAuthenticated: true, hasApiKey: true });
          setIsInitializing(false);
          return;
        }

        // Then check secure storage
        const hasStoredKey = await secureStorage.hasApiKey();
        if (hasStoredKey) {
          const success = await chatGPTService.initializeFromStorage();
          if (success) {
            setAuthState({ isAuthenticated: true, hasApiKey: true });
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await chatGPTService.validateApiKey(apiKey, rememberKey);

      if (isValid) {
        setAuthState({ isAuthenticated: true, hasApiKey: true });
      } else {
        alert("Invalid API key. Please check your OpenAI API key.");
      }
    } catch (error) {
      console.error("API key validation failed:", error);
      alert("Failed to validate API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthState({ isAuthenticated: false, hasApiKey: false });
    setMessages([]);
    setApiKey("");
    await chatGPTService.clearApiKey();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const response = await chatGPTService.sendMessage(currentInput);

      if (response.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${response.error}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>ChatGPT Desktop Client</h1>
          <p>Initializing...</p>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>ChatGPT Desktop Client</h1>
          <p>Enter your OpenAI API key to start chatting</p>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              placeholder="OpenAI API Key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <div className="remember-option">
              <label>
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                />
                Remember API key securely
              </label>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Validating..." : "Connect"}
            </button>
          </form>
          <p className="note">
            Your API key is stored locally and securely on your device.
            <br />
            You can get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI Platform
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>ChatGPT Desktop Client</h1>
        <div className="user-info">
          <span>Connected to OpenAI</span>
          <button onClick={handleLogout} className="logout-btn">
            Disconnect
          </button>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.isUser ? "user-message" : "ai-message"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputText.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
