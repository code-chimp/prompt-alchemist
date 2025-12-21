# Getting Started

This guide will help you set up the development environment and start building with this Tauri + React application.

## Prerequisites

### Required Software

1. **Node.js** - Version 24.12.0 (managed by Volta or nvm)
   - Install Volta: https://volta.sh/
   - Or use nvm with `.nvmrc`: `nvm use`

2. **Rust** - Latest stable version
   ```bash
   # Install Rust via rustup
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

   # Update Rust (if already installed)
   rustup update
   ```

3. **System Dependencies** (varies by platform)

   **macOS:**
   ```bash
   xcode-select --install
   ```

   **Linux (Debian/Ubuntu):**
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev \
     build-essential \
     curl \
     wget \
     file \
     libxdo-dev \
     libssl-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev
   ```

   **Windows:**
   - Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

### Recommended Tools

- **VS Code** with extensions:
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tauri2-react-starter
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers (for E2E tests)
npm run e2e:install
```

### 3. Verify Setup

Check that Rust and Node.js are correctly installed:

```bash
# Check Node.js version (should be 24.12.0)
node --version

# Check Rust version
rustc --version
cargo --version

# Check Tauri CLI
npm run tauri -- --version
```

## Development Workflow

### Running the App

#### Option 1: Browser Development (Fast Iteration)

For rapid UI development without Tauri overhead:

```bash
npm run dev
```

- Opens at `http://localhost:1420`
- Hot Module Replacement (HMR) enabled
- **Note:** Tauri commands will not work in browser mode

#### Option 2: Tauri Development (Full App)

For testing with the Rust backend:

```bash
npm run tauri:dev
```

- Builds and launches the Tauri desktop app
- HMR still works for React code
- Rust code changes require restart
- Full access to Tauri APIs

### Project Structure Quick Tour

```
.
├── src/                    # React frontend
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # React entry point
│   ├── components/ui/      # shadcn/ui components
│   └── lib/
│       ├── tauri.ts        # Typed Tauri command wrappers
│       └── utils.ts        # Utility functions
├── src-tauri/              # Rust backend
│   ├── src/lib.rs          # Tauri command handlers
│   ├── src/main.rs         # Rust entry point
│   └── tauri.conf.json     # Tauri configuration
├── tests/                  # E2E tests (Playwright)
└── docs/                   # Documentation
```

## Common Development Tasks

### Adding a New React Component

1. Create component file:
   ```bash
   # For custom components
   touch src/components/MyComponent.tsx
   ```

2. Or use shadcn/ui CLI for base components:
   ```bash
   npx shadcn@latest add [component-name]
   # Example: npx shadcn@latest add dialog
   ```

3. Import and use:
   ```typescript
   import { MyComponent } from '@/components/MyComponent';
   ```

### Adding a New Tauri Command

See [Adding New Commands](./1-architecture.md#adding-new-commands) in the Architecture documentation.

Quick summary:

1. **Define in Rust** (`src-tauri/src/lib.rs`):
   ```rust
   #[tauri::command]
   fn my_command(arg: String) -> String {
       format!("Processed: {}", arg)
   }
   ```

2. **Register handler**:
   ```rust
   .invoke_handler(tauri::generate_handler![greet, my_command])
   ```

3. **Add TypeScript wrapper** (`src/lib/tauri.ts`):
   ```typescript
   export const commands = {
     greet: 'greet',
     myCommand: 'my_command',
   } as const;

   export async function myCommand(arg: string): Promise<string> {
     return invokeCmd<string>(commands.myCommand, { arg });
   }
   ```

4. **Use in components**:
   ```typescript
   import { myCommand } from '@/lib/tauri';
   const result = await myCommand('test');
   ```

### Code Quality Checks

#### Linting

```bash
# Check all files
npm run lint

# Auto-fix issues
npm run fix
```

#### Testing

```bash
# Run unit tests
npm run test:unit

# Run E2E tests (requires built app)
npm run test:e2e

# Run tests in watch mode
npm run test:unit -- --watch
```

### Building for Production

#### Build Web Assets Only

```bash
npm run build
```

- Output: `dist/` directory
- TypeScript compilation + Vite bundle

#### Build Desktop Application

```bash
npm run tauri:build
```

- Builds optimized Rust binary
- Creates platform-specific installers
- Output: `src-tauri/target/release/bundle/`

Supported platforms:
- **macOS**: `.app`, `.dmg`
- **Windows**: `.exe`, `.msi`
- **Linux**: `.deb`, `.AppImage`

### Cleaning Build Artifacts

```bash
npm run clean
```

Removes:
- `dist/`
- `src-tauri/target/`
- `src-tauri/build/`

## Environment Variables

### Development Mode

- `TAURI_DEV_HOST` - Custom dev host (optional)
- `RUST_BACKTRACE=1` - Enabled in `tauri:dev` script for debugging

### Adding New Environment Variables

1. **Frontend** (Vite):
   ```typescript
   // vite-env.d.ts already configured
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

2. **Backend** (Rust):
   ```rust
   use std::env;
   let api_key = env::var("API_KEY").unwrap_or_default();
   ```

## Git Workflow

### Commit Hooks

The project uses Husky + lint-staged:

```bash
git add .
git commit -m "feat: add new feature"
```

**Pre-commit hook runs:**
- ESLint on staged `.ts`/`.tsx` files
- Prettier on staged files
- Stylelint on staged `.css` files

### Bypassing Hooks (Not Recommended)

```bash
git commit --no-verify -m "message"
```

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Rust build errors

**Solution:**
```bash
# Update Rust
rustup update

# Clean Rust build cache
cd src-tauri
cargo clean
cd ..

# Rebuild
npm run tauri:dev
```

### Issue: Tauri commands not working

**Checklist:**
1. Is the command registered in `generate_handler![]`?
2. Does the command name match in Rust and TypeScript?
3. Is the Tauri app running (`npm run tauri:dev`)?
4. Check browser console for errors

### Issue: HMR not working

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### Issue: Port 1420 already in use

**Solution:**
```bash
# Find and kill process
# macOS/Linux:
lsof -ti:1420 | xargs kill -9

# Windows:
netstat -ano | findstr :1420
taskkill /PID <PID> /F
```

## Learning Resources

### Official Documentation
- [Tauri Docs](https://tauri.app/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### Tutorials
- [Tauri + React Tutorial](https://tauri.app/start/create-project/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Rust Book](https://doc.rust-lang.org/book/)

### Community
- [Tauri Discord](https://discord.com/invite/tauri)
- [Tauri GitHub Discussions](https://github.com/tauri-apps/tauri/discussions)

## Next Steps

1. ✅ Set up development environment
2. ✅ Run the app (`npm run tauri:dev`)
3. 📚 Read the [Architecture Documentation](./1-architecture.md)
4. 🛠️ Explore the [Tech Stack](./2-tech-stack.md)
5. 🚀 Start building!

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (browser only) |
| `npm run tauri:dev` | Start Tauri app with HMR |
| `npm run build` | Build frontend assets |
| `npm run tauri:build` | Build production desktop app |
| `npm run lint` | Run all linters |
| `npm run fix` | Auto-fix linting issues |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run clean` | Clean build artifacts |

## Getting Help

- 📖 Check the [docs/](.) folder for detailed documentation
- 🐛 Found a bug? Open an issue
- 💡 Have a question? Start a discussion
- 📧 Contact: tim@code-chimp.com
