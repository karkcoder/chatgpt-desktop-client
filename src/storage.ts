import { Store } from "@tauri-apps/plugin-store";

class SecureStorage {
  private store: Store | null = null;
  private readonly API_KEY_KEY = "openai_api_key";

  private async getStore(): Promise<Store> {
    if (!this.store) {
      this.store = await Store.load("config.json");
    }
    return this.store;
  }

  async saveApiKey(apiKey: string): Promise<void> {
    try {
      const store = await this.getStore();
      await store.set(this.API_KEY_KEY, apiKey);
      await store.save();
    } catch (error) {
      console.error("Failed to save API key:", error);
      throw new Error("Failed to save API key securely");
    }
  }

  async getApiKey(): Promise<string | null> {
    try {
      const store = await this.getStore();
      const apiKey = await store.get<string>(this.API_KEY_KEY);
      return apiKey || null;
    } catch (error) {
      console.error("Failed to retrieve API key:", error);
      return null;
    }
  }

  async removeApiKey(): Promise<void> {
    try {
      const store = await this.getStore();
      await store.delete(this.API_KEY_KEY);
      await store.save();
    } catch (error) {
      console.error("Failed to remove API key:", error);
      throw new Error("Failed to remove API key");
    }
  }

  async hasApiKey(): Promise<boolean> {
    try {
      const apiKey = await this.getApiKey();
      return apiKey !== null && apiKey.trim() !== "";
    } catch (error) {
      console.error("Failed to check API key existence:", error);
      return false;
    }
  }
}

export const secureStorage = new SecureStorage();
