# Prompt Alchemist

> A desktop application for crafting high-quality, structured prompts for Large Language Models

[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](LICENSE)

![Tauri v2](https://img.shields.io/badge/Tauri-v2-24c8db?logo=tauri&logoColor=white) ![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![Rust 2021](https://img.shields.io/badge/Rust-2021-000000?logo=rust&logoColor=white)

![Code Style: ESLint + Prettier](https://img.shields.io/badge/Code%20Style-ESLint%20%2B%20Prettier-4B32C3) ![Tests: Vitest + Playwright](https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-6E9F18)

Prompt Alchemist empowers developers and prompt engineers to build better LLM interactions through reusable components. Create libraries of expert personas, architectural patterns, and guardrails, then compose them into consistent, high-quality prompts that get better results from ChatGPT, Claude, Grok, and other LLMs.

**Note:** This is an early-stage prototype demonstrating Tauri's capabilities in building performant desktop tools for developer workflows.


## Why Prompt Alchemist?
 
- 📚 **Reusable Component Library** – Build a personal collection of personas, architectures, and guardrails
- 🎯 **Template-Based Composition** – Assemble prompts from proven components, no repetitive setup
- 👁️ **Real-Time Preview** – See your complete prompt before copying to your LLM
- 💾 **Local-First & Private** – All data stored locally, no cloud dependencies or data sharing
- 🔄 **Export & Share** – Save libraries as JSON/YAML for version control and team collaboration
- ⚡ **Fast & Lightweight** – Native desktop performance with ~3-5MB binaries
- 🔒 **Built on Modern Tech** – React 19, Tauri v2, TypeScript with end-to-end type safety

### Core Capabilities

| Feature | Status |
| ------- | ------ |
| **Persona Library** | 🚧 *Planned* – Expert profiles with specialized knowledge |
| **Architecture Templates** | 🚧 *Planned* – Design patterns (DDD, Microservices, Clean Architecture) |
| **Guardrails** | 🚧 *Planned* – Constraints, output formats, ethical guidelines |
| **Prompt Composition** | 🚧 *Planned* – Drag-and-drop template builder |
| **Search & Organization** | 🚧 *Planned* – Tagging, categorization, quick retrieval |
| **Export/Import** | 🚧 *Planned* – JSON/YAML format for version control |
| **Real-Time Preview** | 🚧 *Planned* – Syntax highlighting and validation |


## Quick Start

```bash
# Prerequisites: Node.js 24.12.0 + Rust (latest stable)

# Clone and install
git clone https://github.com/code-chimp/prompt-alchemist.git
cd prompt-alchemist
npm install

# Start the application
npm run tauri:dev
```

**New to Tauri or need detailed setup instructions?** See the [**Getting Started Guide**](docs/0-getting-started.md) for prerequisites, platform-specific dependencies, and troubleshooting.

## What You Can Do with Prompt Alchemist

### Example Workflow (Roadmap)

Once the core features are implemented, your workflow will look like this:

1. **Create a Persona**: "Senior React Developer with expertise in Zustand state management and TanStack Router"
2. **Select an Architecture**: Domain-Driven Design (DDD)
3. **Add Guardrails**: "Output as a step-by-step plan in markdown format" + "Ensure accessibility standards"
4. **Generate Your Prompt**: 

   > "As a Senior React Developer with expertise in Zustand and TanStack Router, design a component using Domain-Driven Design principles. Provide a step-by-step plan in markdown format, ensuring adherence to accessibility standards."

5. **Copy & Use**: Paste into ChatGPT, Claude, or your preferred LLM for consistent, high-quality responses

### Build Your Library (Planned Features)

- **Personas**: Software architects, domain experts, security specialists, UX designers
- **Architectures**: DDD, Hexagonal, Event-Driven, Microservices, Monolith-first
- **Guardrails**: Code style requirements, testing expectations, performance constraints, ethical guidelines

Once built, mix and match components to generate tailored prompts for any development task.

## Documentation

Comprehensive documentation for understanding and contributing to Prompt Alchemist:

### 📖 Core Documentation
| Guide | Description |
|-------|-------------|
| [**Getting Started**](docs/0-getting-started.md) | Setup, installation, and first steps |
| [**Architecture**](docs/1-architecture.md) | System design with diagrams, IPC layer, data flow |
| [**Tech Stack**](docs/2-tech-stack.md) | Technologies used and why we chose them |

### 🛠️ Development Guides
 | Guide | Description |
 |-------|-------------|
 | [**Development Guide**](docs/3-development-guide.md) | Patterns, conventions, and best practices |
 | [**Testing Guide**](docs/4-testing-guide.md) | Unit tests, E2E tests, and testing strategies |
 | [**Contributing**](docs/5-contributing.md) | How to contribute to the project |
 | [**Personalizing**](docs/6-personalizing.md) | How to customize the template for your project |
 | [**TECH_DEBT**](TECH_DEBT.md) | Roadmap for CI/CD, security, and production readiness |
 

## Essential Commands

### For Users
```bash
# Run the application
npm run tauri:dev        # Full Tauri app with hot reload
npm run dev              # Browser preview (limited - no Tauri APIs)
```

### For Contributors
```bash
# Production Build
npm run build            # Build frontend assets
npm run tauri:build      # Create platform-specific installer

# Code Quality
npm run lint             # Check code quality (ESLint, Prettier, Stylelint)
npm run fix              # Auto-fix linting issues

# Testing
npm run test:unit        # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
```

> **💡 Tip:** See the full list of scripts in [package.json](package.json) or the [Getting Started Guide](docs/0-getting-started.md#common-development-tasks).

## Project Structure

```
prompt-alchemist/
├── src/                    # React frontend
│   ├── components/ui/      # UI components (forms, dialogs, lists)
│   ├── lib/
│   │   ├── tauri.ts        # Typed Tauri command wrappers
│   │   └── utils.ts        # Helper utilities
│   ├── App.tsx             # Main application layout
│   └── main.tsx
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Tauri command handlers
│   │   └── main.rs         # App entry point
│   └── tauri.conf.json     # App configuration
├── tests/                  # E2E tests (Playwright)
└── docs/                   # 📚 Technical documentation
```

> **📐 Want to understand the architecture?** Check out the [**Architecture Documentation**](docs/1-architecture.md) with detailed diagrams and explanations.

## Tech Stack at a Glance

Built on a modern, performant stack for a responsive prompt engineering experience:

**UI:** React 19 • TypeScript 5.9 • Vite 7 • Tailwind CSS 4 • shadcn/ui  
**Desktop:** Tauri v2 • Rust 2021  
**Storage:** Local file system (Tauri APIs) • IndexedDB *(planned)*  
**Testing:** Vitest (unit) • Playwright (E2E) • Testing Library  
**Quality:** ESLint • Prettier • Stylelint • Husky • lint-staged  
**DX:** React Compiler • Path aliases (`@/`) • Lockfile validation
 
> **🔍 Deep dive:** See [**Tech Stack Documentation**](docs/2-tech-stack.md) for version details, dependencies, and design rationale.


## Key Features Deep Dive

### Component Library Management (Planned)

The core of Prompt Alchemist is its reusable component system. You'll be able to store:

**Personas** – Expert profiles with specialized knowledge:
```typescript
{
  name: "Senior React Developer",
  expertise: ["Zustand", "TanStack Router", "TypeScript", "Accessibility"],
  context: "10+ years building production React applications",
  tone: "Pragmatic, focused on maintainability"
}
```

**Architectures** – Design patterns and methodologies:
```typescript
{
  name: "Domain-Driven Design (DDD)",
  description: "Tactical patterns for complex business logic",
  keyPrinciples: ["Bounded Contexts", "Aggregates", "Entities", "Value Objects"],
  bestFor: "Complex domains with rich business rules"
}
```

**Guardrails** – Constraints and guidelines:
```typescript
{
  name: "TypeScript Best Practices",
  rules: [
    "Prefer interfaces over types for object shapes",
    "Use strict null checks",
    "Avoid 'any' type"
  ],
  outputFormat: "Step-by-step explanation with code examples"
}
```

### Template Composition (Planned)

Combine components using a visual editor:
- Drag-and-drop interface for assembling prompts
- Preview generated text in real-time
- Validation to ensure all required fields are complete
- Save frequently-used combinations as templates

### Export & Version Control (Planned)

Save your libraries for backup and sharing:

```bash
# Export your entire library
File → Export Library → prompt-library.json

# Share with your team via Git
git add prompt-library.json
git commit -m "Add DDD architecture templates"
git push
```

Import libraries from teammates or the community to expand your toolkit.

### Local-First Storage

All data stays on your machine:
- ✅ No cloud accounts required
- ✅ No data sent to external services
- ✅ Full control over your intellectual property
- ✅ Fast, offline-capable
- ✅ Works anywhere, no internet needed

## Roadmap

Prompt Alchemist is an early-stage prototype. Here's what we're working toward:

### Current Focus
- [ ] **Basic Library Management** – Create, edit, delete personas, architectures, and guardrails
- [ ] **Local Storage** – Persist data using Tauri's file system APIs
- [ ] **Simple Composition** – Select and combine components into prompts
- [ ] **Copy to Clipboard** – One-click export of generated prompts

### Future Features
- [ ] **Search & Filtering** – Find components by tags, keywords, or categories
- [ ] **Import/Export** – JSON/YAML format for sharing libraries
- [ ] **Real-Time Preview** – Syntax highlighting and validation
- [ ] **Template System** – Save frequently-used component combinations
- [ ] **Direct LLM Integration** – Test prompts against OpenAI, Anthropic, or local models
- [ ] **Prompt History** – Track and iterate on previous generations
- [ ] **Community Templates** – Browse and import shared libraries
- [ ] **Plugin System** – Extend with custom component types

### Long-Term Vision
- [ ] **Prompt Analytics** – Track which components generate the best results
- [ ] **Multi-User Sync** – Share libraries across devices (optional)
- [ ] **AI-Assisted Generation** – Suggest personas/guardrails based on context

**Want to contribute?** Check out the [Contributing Guide](docs/5-contributing.md) to get started.

## For Contributors

The following sections are for developers contributing to Prompt Alchemist:

## Code Quality Built-In

Pre-commit hooks automatically enforce quality standards:

- ✅ ESLint checks for code issues
- ✅ Prettier formats code
- ✅ Stylelint validates CSS
- ✅ TypeScript strict mode enabled

Failed checks block commits, ensuring consistent code quality across the team.

## Testing Made Easy

```bash
# Unit tests with Vitest (fast, Vite-native)
npm run test:unit

# E2E tests with Playwright (browser automation)
npm run test:e2e

# Coverage reports
npm run test:unit -- --coverage
```

Mock Tauri commands easily:

```typescript
vi.mock('@/lib/tauri', () => ({
  greet: vi.fn().mockResolvedValue('Hello, Test!')
}));
```

> **🧪 Full testing guide:** See [**Testing Documentation**](docs/4-testing-guide.md) for patterns, best practices, and examples.

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [**Development Guide**](docs/3-development-guide.md) for code patterns
4. Write tests (see [**Testing Guide**](docs/4-testing-guide.md))
5. Submit a Pull Request

Read the full [**Contributing Guidelines**](docs/5-contributing.md) for commit conventions, PR process, and code review expectations.

## Building for Production

```bash
# Creates platform-specific installers in src-tauri/target/release/bundle/
npm run tauri:build
```

Outputs:
- **macOS:** `.app`, `.dmg`
- **Windows:** `.exe`, `.msi`
- **Linux:** `.deb`, `.AppImage`

Binary sizes typically range from 3-5MB thanks to Tauri's efficient bundling.

## LLM-Friendly Documentation

This project is designed for human developers **and** AI assistants:

- 🤖 All documentation uses clear structure and examples
- 🤖 Architecture diagrams show component relationships
- 🤖 Code patterns are explicitly documented
- 🤖 Type signatures provide context for all APIs

When using an LLM to help with this codebase, share:
- [Architecture docs](docs/1-architecture.md) for system design context
- [Tech Stack docs](docs/2-tech-stack.md) for dependency information
- [Development Guide](docs/3-development-guide.md) for code conventions

## FAQ

<details>
<summary><strong>Who is Prompt Alchemist for?</strong></summary>

Developers, prompt engineers, and AI enthusiasts who frequently use LLMs (ChatGPT, Claude, Grok, etc.) for code generation, architecture design, debugging, or problem-solving. If you find yourself writing similar prompt structures repeatedly, this tool will save you time and improve consistency.
</details>

<details>
<summary><strong>What's the current status of the project?</strong></summary>

Prompt Alchemist is an early-stage prototype. Core features like library management, prompt composition, and export are planned but not yet implemented. We're building in the open and welcome contributors. Check the [Roadmap](#roadmap) for details.
</details>

<details>
<summary><strong>Do I need to create an account or connect to the cloud?</strong></summary>

No. Prompt Alchemist stores all data locally on your machine. Your personas, architectures, and prompts never leave your computer unless you explicitly export and share them.
</details>

<details>
<summary><strong>Can I share my prompt libraries with my team?</strong></summary>

Yes! (Planned feature) You'll be able to export your library as JSON or YAML, then share via Git, Dropbox, or any file-sharing method. Team members can import and extend your templates.
</details>

<details>
<summary><strong>Does it support direct LLM API calls?</strong></summary>

Not yet. This is on the roadmap. Currently, the plan is to generate prompts that you copy and paste into your LLM interface of choice (ChatGPT, Claude, etc.). Future versions may include built-in API integration for testing prompts directly.
</details>

<details>
<summary><strong>What LLMs does this work with?</strong></summary>

Any text-based LLM. Prompt Alchemist generates plain text prompts that work with ChatGPT, Claude, Grok, Gemini, local models (Ollama, LM Studio), or any API-based service. The prompts are LLM-agnostic.
</details>

<details>
<summary><strong>Can I use this for commercial projects?</strong></summary>

Yes! The BSD 3-Clause license allows commercial and private use, modification, and redistribution, as long as you retain the copyright and license notice and do not use the author's name to endorse derived products.
</details>

<details>
<summary><strong>Does this work with TypeScript strict mode?</strong></summary>

Yes, strict mode is enabled by default. The entire codebase is type-safe from frontend to backend.
</details>

<details>
<summary><strong>How do I report bugs or request features?</strong></summary>

Open an issue on [GitHub Issues](https://github.com/code-chimp/prompt-alchemist/issues). For general discussion, check the [Discussions](https://github.com/code-chimp/prompt-alchemist/discussions) tab.
</details>

## License

[BSD 3-Clause License](LICENSE) - A permissive open source license that allows commercial use, modification, and redistribution with attribution and a non-endorsement clause.

## Author

**Tim Goshinski** • [tim@code-chimp.com](mailto:tim@code-chimp.com) • [code-chimp.com](https://code-chimp.com) • [@code-chimp](https://github.com/code-chimp)

## Acknowledgments

Built with outstanding open source tools:
- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

**Ready to improve your LLM workflows?**

[📚 Get Started](docs/0-getting-started.md) • [💬 Discussions](https://github.com/code-chimp/prompt-alchemist/discussions) • [🐛 Report Issues](https://github.com/code-chimp/prompt-alchemist/issues)

⭐ If this project interests you, give it a star and watch for updates!

</div>
