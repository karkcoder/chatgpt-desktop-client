# ChatGPT Desktop Client - Secure API Key Storage

## New Feature: Secure API Key Storage

This application now supports secure storage of your OpenAI API key, so you don't have to enter it every time you use the app.

### How It Works

1. **First Time Setup**: When you first launch the app, you'll see a login screen where you can enter your OpenAI API key.

2. **Remember API Key**: There's a checkbox "Remember API key securely" that's checked by default. When enabled, your API key will be stored securely using Tauri's secure storage system.

3. **Automatic Login**: On subsequent launches, the app will automatically load your stored API key and authenticate you without requiring manual entry.

4. **Secure Storage**: The API key is stored using Tauri's secure storage plugin, which uses the operating system's secure storage mechanisms:
   - **Windows**: Windows Credential Manager
   - **macOS**: Keychain
   - **Linux**: Secret Service (libsecret)

### Features

- ✅ **Secure Storage**: API keys are stored using OS-level secure storage
- ✅ **Auto-login**: Automatically authenticate on app startup
- ✅ **Manual Override**: You can still enter a different API key if needed
- ✅ **Easy Logout**: Clear stored credentials with the "Disconnect" button
- ✅ **Validation**: API keys are validated before being stored
- ✅ **Error Handling**: Proper error handling for storage operations

### Usage

1. **First Launch**:

   - Enter your OpenAI API key (get it from [OpenAI Platform](https://platform.openai.com/api-keys))
   - Keep "Remember API key securely" checked
   - Click "Connect"

2. **Subsequent Launches**:

   - The app will show "Initializing..." briefly
   - If a valid API key is stored, you'll be automatically logged in
   - If no key is stored or it's invalid, you'll see the login screen

3. **Logout/Clear Storage**:
   - Click "Disconnect" to clear the stored API key
   - You'll need to re-enter your key on the next launch

### Security Notes

- API keys are never stored in plain text
- The secure storage is managed by your operating system
- API keys are only used to authenticate with OpenAI's servers
- The app follows security best practices for credential storage

### Development

The secure storage functionality is implemented in:

- `src/storage.ts` - Secure storage wrapper using Tauri's store plugin
- `src/chatgpt-service.ts` - Updated to use secure storage
- `src/App.tsx` - Updated UI with remember option and auto-login

### No Username/Password Support

Note: OpenAI's API only supports API key authentication. Username/password authentication is not available through their official API. The secure storage feature is the best alternative to make API key usage more convenient while maintaining security.
