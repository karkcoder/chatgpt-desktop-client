# ChatGPT Desktop Client

A modern React and Tauri-based desktop application for ChatGPT that runs on Linux. This application provides a native desktop experience for interacting with ChatGPT using your OpenAI API key.

## Features

- 🖥️ **Native Desktop App**: Built with Tauri for a lightweight, secure desktop experience
- 🔐 **OpenAI Integration**: Real ChatGPT API integration with your OpenAI API key
- � **Secure API Key Storage**: Automatic, secure storage of API keys using OS-level encryption
- �💬 **Chat Interface**: Modern, responsive chat interface with message history
- 🎨 **Beautiful UI**: Clean, modern design with smooth animations
- 🔄 **Real-time Updates**: Live typing indicators and message status
- 📱 **Responsive**: Works on different screen sizes
- � **Enhanced Security**: Tauri provides security advantages over traditional Electron apps
- ⚡ **GPT-3.5 Turbo**: Uses OpenAI's GPT-3.5 Turbo model for fast responses
- 🔑 **Auto-Login**: Remembers your API key securely for seamless experience

## Technologies Used

- **React 19** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **Tauri** - Desktop application framework (Rust-based)
- **Tauri Store Plugin** - Secure, cross-platform storage for sensitive data
- **Vite** - Fast build tool and development server
- **OpenAI API** - Real ChatGPT integration
- **CSS3** - Modern styling with animations
- **OS Secure Storage** - Platform-specific secure credential storage
  - macOS: Keychain Services
  - Windows: Windows Credential Manager
  - Linux: Secret Service API (GNOME Keyring, KDE Wallet)

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Rust** (for Tauri)
- **Linux** operating system
- **OpenAI API Key** - Get yours from [OpenAI Platform](https://platform.openai.com/api-keys)

### Installing Rust

If you don't have Rust installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chatgpt-desktop-client
```

2. Install dependencies:

```bash
npm install
```

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Get your OpenAI API key**:

   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

3. **Run the application**:

   ```bash
   npm run tauri:dev
   ```

4. **First-time setup**:

   - Enter your OpenAI API key in the login screen
   - Check "Remember API key securely" (recommended)
   - Click "Connect"

5. **Start chatting**:
   - Your API key is now securely stored
   - Future launches will auto-authenticate
   - Start typing messages in the chat interface

That's it! The app will remember your credentials securely.

## Configuration

### OpenAI API Key

You need an OpenAI API key to use this application. You can get one from [OpenAI Platform](https://platform.openai.com/api-keys).

#### Option 1: Secure In-App Storage (Recommended)

The application now features **secure API key storage** that automatically saves your API key using your operating system's secure storage mechanisms:

- **macOS**: Keychain Services
- **Windows**: Windows Credential Manager
- **Linux**: Secret Service API (GNOME Keyring, KDE Wallet, etc.)

Simply enter your API key when prompted, and check "Remember API key securely" to store it safely. The app will automatically authenticate you on subsequent launches.

#### Option 2: Environment Variable

For development or automated deployments, you can set the API key as an environment variable:

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file and add your OpenAI API key:

```bash
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Security Features:**

- ✅ **OS-Level Encryption**: API keys are encrypted using your operating system's secure storage
- ✅ **Local Storage Only**: Keys never leave your device except for OpenAI API calls
- ✅ **Easy Management**: Clear stored credentials with one click
- ✅ **Automatic Login**: Seamless authentication on app restart
- ✅ **Validation**: API keys are validated before storage

3. Install Tauri CLI (if not already installed):

```bash
npm install -g @tauri-apps/cli
```

## Development

To run the application in development mode:

```bash
npm run tauri:dev
```

This will start the Vite development server and launch the Tauri application window.

## Building

To build the application for production:

```bash
npm run tauri:build
```

The built application will be available in the `src-tauri/target/release/bundle/` directory.

## Project Structure

```
chatgpt-desktop-client/
├── src/
│   ├── App.tsx              # Main React component
│   ├── App.css              # Application styles
│   ├── chatgpt-service.ts   # ChatGPT API integration
│   ├── storage.ts           # Secure API key storage
│   ├── config.ts            # Configuration management
│   └── main.tsx             # React entry point
├── src-tauri/
│   ├── src/
│   │   ├── main.rs          # Tauri main process
│   │   └── lib.rs           # Tauri library configuration
│   ├── tauri.conf.json      # Tauri configuration
│   └── Cargo.toml           # Rust dependencies
├── package.json             # Node.js dependencies
└── README.md               # This file
```

## How It Works

The application integrates with OpenAI's ChatGPT API using the following flow:

1. **Initialization**: App checks for stored API key using secure storage
2. **Authentication**: Enter your OpenAI API key if not already stored
3. **API Validation**: The app validates your API key with OpenAI
4. **Secure Storage**: API key is encrypted and stored using OS-level security
5. **Chat Interface**: Send messages through the chat interface
6. **Real-time Responses**: Messages are sent to OpenAI's GPT-3.5 Turbo model
7. **Response Handling**: AI responses are displayed in the chat interface
8. **Auto-Login**: Subsequent launches automatically authenticate using stored credentials

### Secure Storage Implementation

The app uses Tauri's secure storage plugin which provides:

- **Cross-platform security**: Uses each OS's native secure storage
- **Encryption**: API keys are encrypted at rest
- **Access control**: Only the app can access its stored credentials
- **User control**: Easy logout clears all stored data

### Error Handling

The application handles various API errors:

- Invalid API keys
- Rate limiting
- Network errors
- Invalid requests

### Customization

You can customize the application by:

- Modifying the styles in `src/App.css`
- Updating the Tauri configuration in `src-tauri/tauri.conf.json`
- Adding new features to the React components
- Changing the OpenAI model in `src/chatgpt-service.ts`

## Security Considerations

- **API Key Storage**: API keys are encrypted and stored using OS-level secure storage (Keychain, Credential Manager, Secret Service)
- **Authentication**: Proper authentication validation with OpenAI before storage
- **Local Only**: Credentials never leave your device except for OpenAI API calls
- **Updates**: Keep dependencies updated for security patches
- **Permissions**: Tauri provides fine-grained permission control
- **Clear Credentials**: Easy logout functionality clears all stored data
- **Validation**: API keys are validated before being stored

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [x] Real ChatGPT API integration
- [x] Secure API key storage with OS-level encryption
- [x] Auto-login functionality
- [ ] Dark/Light theme toggle
- [ ] Message export functionality
- [ ] Settings panel
- [ ] Conversation history persistence
- [ ] Multiple conversation support
- [ ] Keyboard shortcuts
- [ ] Auto-updater
- [ ] Plugin system

## Support

For support, please create an issue on the GitHub repository.

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI inspired by modern chat applications
- Icons and design patterns from Material Design
