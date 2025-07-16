import OpenAI from "openai";
import { secureStorage } from "./storage";

export interface ChatGPTResponse {
  text: string;
  error?: string;
}

export class ChatGPTService {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    // Try to get API key from environment variables or parameter
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const keyToUse = apiKey || envApiKey;

    if (keyToUse) {
      this.setApiKey(keyToUse);
    } else {
      // Try to load from secure storage
      this.loadStoredApiKey();
    }
  }

  private async loadStoredApiKey(): Promise<void> {
    try {
      const storedApiKey = await secureStorage.getApiKey();
      if (storedApiKey) {
        this.setApiKey(storedApiKey);
      }
    } catch (error) {
      console.error("Failed to load stored API key:", error);
    }
  }

  async setApiKey(apiKey: string, saveToStorage = true): Promise<void> {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    });

    if (saveToStorage) {
      try {
        await secureStorage.saveApiKey(apiKey);
      } catch (error) {
        console.error("Failed to save API key to storage:", error);
      }
    }
  }

  async clearApiKey(): Promise<void> {
    this.apiKey = null;
    this.openai = null;
    try {
      await secureStorage.removeApiKey();
    } catch (error) {
      console.error("Failed to remove API key from storage:", error);
    }
  }

  async initializeFromStorage(): Promise<boolean> {
    try {
      const storedApiKey = await secureStorage.getApiKey();
      if (storedApiKey) {
        this.setApiKey(storedApiKey, false); // Don't save again
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to initialize from storage:", error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.openai !== null && this.apiKey !== null;
  }

  async sendMessage(message: string): Promise<ChatGPTResponse> {
    if (!this.openai) {
      return {
        text: "",
        error: "API key not configured. Please set your OpenAI API key.",
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const responseText =
        completion.choices[0]?.message?.content || "No response received";

      return {
        text: responseText,
      };
    } catch (error: unknown) {
      console.error("OpenAI API Error:", error);

      // Handle specific OpenAI errors
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as { status: number; message?: string };
        if (apiError.status === 401) {
          return {
            text: "",
            error: "Invalid API key. Please check your OpenAI API key.",
          };
        } else if (apiError.status === 429) {
          return {
            text: "",
            error: "Rate limit exceeded. Please try again later.",
          };
        } else if (apiError.status === 400) {
          return {
            text: "",
            error: "Invalid request. Please check your message.",
          };
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        text: "",
        error: `API Error: ${errorMessage}`,
      };
    }
  }

  async validateApiKey(
    apiKey: string,
    saveOnSuccess = false
  ): Promise<boolean> {
    try {
      const testOpenai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      // Test the API key with a simple request
      await testOpenai.models.list();

      if (saveOnSuccess) {
        await this.setApiKey(apiKey);
      }

      return true;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }
}

export const chatGPTService = new ChatGPTService();
