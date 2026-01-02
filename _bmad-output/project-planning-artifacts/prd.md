---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - _bmad-output/index.md
  - _bmad-output/analysis/brainstorming-session-2025-12-27.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 1
workflowType: 'prd'
lastStep: 11
project_name: 'prompt-alchemist'
user_name: 'Timothygoshinski'
date: '2025-12-28'
---

# Product Requirements Document - prompt-alchemist

**Author:** Timothygoshinski
**Date:** 2025-12-28

## Executive Summary

**Prompt Alchemist** is a desktop application (React + Tauri) that solves two critical problems for developers working with LLMs:

1. **Prompt fatigue** - Developers waste time retyping the same personas, constraints, and guardrails every time they start a new agent session
2. **Inconsistent results** - Ad-hoc freeform prompts produce unpredictable quality, leading to frustration and wasted iterations

The solution combines **reusable snippet libraries** with **proven prompt frameworks** in a keyboard-first desktop tool optimized for speed and learning.

**How It Works:**

Instead of retyping "You are a senior C# developer with expertise in IDesign architecture..." every session, users build prompts by composing reusable atomic snippets:
- Select "Senior Developer" (role) + "C#" (technology) + "IDesign" (architecture) = complete persona
- Add common guardrails ("No external dependencies", "Windows-compatible")
- Choose framework structure (RTF, CODER, or Co-Star) to organize the prompt
- Framework conversion lets you experiment: build in CODER, switch to Co-Star, see which works better

**Speed Through Structure:**
- Keyboard-first navigation (Cmd+K search, tab stops, VSCode shortcuts)
- Search-enabled tab stops: Press Tab → inline search opens → type to filter → Enter to insert
- No mode switching between structured composition and freeform editing
- Native desktop integration: clipboard, file system, no network latency

**Target Users:**
- **Primary:** Developers who use LLMs for code generation and technical tasks (Cursor, Claude Desktop, ChatGPT)
- **Secondary:** Technical writers, DevRel professionals, product managers who create content prompts
- **Tertiary:** Anyone wanting to improve prompt quality and build reusable prompt libraries

**Core Capabilities:**
- Atomic snippet library (personas, guardrails, constraints stored as composable components)
- Three proven frameworks: **RTF** (Role-Task-Format, 3 sections), **CODER** (Context-Objective-Details-Examples-Response, 5 sections), **Co-Star** (Context-Objective-Style-Tone-Audience-Response, 6 sections by Sheila Teo)
- Framework conversion engine (switch between structures to experiment)
- Search with frecency ranking (frequently + recently used items surface first)
- Side-by-side composition with live markdown preview
- Cross-platform desktop app (macOS, Windows, Linux) with native file system storage

### What Makes This Special

**Education through usage** - Prompt Alchemist doesn't just help users compose prompts faster; it teaches them to write better prompts through passive, unobtrusive guidance:

- **Ghost text suggestions** show what a complete persona looks like as you type (dismissible, non-blocking)
- **Quality indicators** (completeness scores, missing sections) teach what makes prompts effective without blocking workflow
- **Framework switching** enables experimentation: "Does CODER work better than RTF for this task?" Find out by converting and comparing results
- **Example template gallery** demonstrates patterns through real, pre-filled prompts (code refactoring, blog posts, documentation)
- **Context-aware hints** provide relevant suggestions based on what's already in the prompt (if you select "C#" persona, C#-related constraints get boosted in search)

**The pedagogical goal:** Users improve their prompt engineering skills naturally as they use the tool - learning by doing, not by reading documentation. Over time, users internalize what makes prompts effective (specificity, structure, examples, constraints) and apply these principles even when writing prompts manually.

**Competitive Differentiation:**
- **Desktop-first** vs web-based SaaS competitors (PromptPerfect, Promptbase): Native speed, offline access, file system integration, no network dependency
- **Keyboard-first** vs mouse-heavy tools: 30-second prompt composition without touching mouse (search, tab stops, shortcuts)
- **Education-first** vs pure snippet managers: Not just storage, but skill-building through usage patterns
- **Framework-agnostic** vs single-methodology tools: Support multiple frameworks, convert between them, discover what works for your use case
- **Developer-optimized** vs general audience tools: VSCode patterns, Git-friendly JSON storage, CLI-exportable libraries

**Integration & Workflow:**
- Works alongside existing tools (Cursor, Claude Desktop, VSCode, ChatGPT)
- Copy-to-clipboard for instant pasting into any LLM interface
- Library stored locally in standard config directories (~/.config, %LOCALAPPDATA%)
- JSON format for snippets (version control friendly, Git-compatible)
- Markdown export for LLM consumption and sharing

## Project Classification

**Technical Type:** Desktop App (developer tool)  
**Domain:** General (developer tooling)  
**Complexity:** Medium  
**Project Context:** Brownfield - extending existing tauri2-react-starter template

**Classification Details:**

This is a **desktop application** built on the tauri2-react-starter foundation with the following characteristics:

- **Platform:** Cross-platform desktop (macOS, Windows, Linux via Tauri v2)
- **Architecture:** Hybrid (React 19 frontend + Rust backend with IPC communication)
- **Category:** Developer tool optimized for keyboard-first power users
- **Integration:** Native file system access for library storage in standard config directories (~/.config, %LOCALAPPDATA%)

**Technology Foundation:**
- Frontend: React 19, TypeScript, Vite, ShadCN UI, Tailwind CSS v4
- Backend: Rust 2021, Tauri v2 for native capabilities
- Storage: JSON format for atomic snippets (Git-friendly), Markdown for export
- Testing: Vitest (unit), Playwright (E2E)

**Complexity Drivers:**
- Sophisticated keyboard-first UX (search-enabled tab stops, frecency ranking)
- Framework conversion engine (RTF ↔ CODER ↔ Co-Star)
- Drag-and-drop composition with live preview
- Cross-platform file system integration
- Real-time fuzzy search with context-aware filtering

**Domain Context:**
General developer tooling domain with no specialized compliance requirements (healthcare, fintech, etc.). Standard software best practices apply with emphasis on developer experience and keyboard efficiency.

**Framework Definitions:**
- **RTF (Role-Task-Format):** Simplest 3-section structure for general-purpose prompts
- **CODER (Context-Objective-Details-Examples-Response):** 5-section framework optimized for code generation and technical tasks
- **Co-Star (Context-Objective-Style-Tone-Audience-Response):** 6-section framework by Sheila Teo, optimized for content creation and creative work

## Success Criteria

### User Success

**Primary Success Metric: Time Saved**

Users experience success when Prompt Alchemist eliminates the repetitive work of retyping personas, constraints, and guardrails across LLM sessions.

**The User Success Journey:**
- **Week 1 (Investment):** User builds initial snippet library, learning the tool and capturing their most-used prompt components
- **Week 2+ (Payoff):** User reuses library snippets instead of retyping, experiencing immediate time savings
- **Ongoing (Compounding):** Library grows with usage, snippet reuse increases, time savings compound over weeks and months

**User Success Moment:** "I saved 2 hours this week by not retyping the same personas and constraints over and over."

**Measurable User Outcomes:**
- **Time to first reused snippet:** Within first 5 prompts created (indicates library is immediately useful)
- **Weekly time savings:** Target 2+ hours saved per active user per week (self-reported or inferred from reuse patterns)
- **Snippet composition speed:** 30-second prompt composition vs 2-5 minutes manual typing
- **User sentiment:** "This was worth it" feedback after first week of usage

**Secondary User Success (Learning):**
While the primary win is time savings, users also improve their prompt engineering skills through usage:
- Framework completeness scores increase over time (users learn what makes prompts effective)
- Quality indicators show improvement in prompt structure
- Users internalize best practices through ghost text and contextual hints

### Business Success

**Primary Business Metric: Engagement**

Business success is measured by sustained user engagement, demonstrated through snippet library usage patterns.

**Leading Indicator: Library Growth**
- **Target:** Users add 5-10 new snippets per month in early weeks
- **Plateau Signal:** Growth rate slows as users capture their core subject matter expertise (expected behavior, not failure)
- **Interpretation:** Library size plateau indicates user has successfully "captured" their prompt knowledge base

**Ongoing Indicator: Snippet Reuse Rate**
- **Target:** 70%+ snippet reuse rate (users compose from library vs typing from scratch)
- **Measurement:** Ratio of library-sourced content vs manually-typed content in completed prompts
- **Success Signal:** High reuse rate indicates library has become the user's "source of truth" for prompts

**Retention Metrics:**
- **7-day return rate:** 60%+ of users return within first week (validated initial value)
- **30-day active users:** 40%+ of users still creating prompts monthly (sustained engagement)
- **Daily usage frequency:** Target 3-4 days per week for active users (regular workflow integration)

**Growth Metrics:**
- **User acquisition:** Organic word-of-mouth from developer communities, GitHub stars, social sharing
- **Framework adoption:** Users try multiple frameworks (RTF, CODER, Co-Star) indicating they're exploring vs just using one feature
- **Community contribution:** Users share library exports, templates, or custom framework definitions (Phase 2)

**Business Success Milestones:**
- **3 months:** 100 active users with 70%+ snippet reuse rate
- **6 months:** 500 active users, library growth plateau observed, high retention signal
- **12 months:** 2,000+ active users, strong community engagement, word-of-mouth growth established

### Technical Success

**Primary Technical Goal: Cross-Platform Consistency**

Technical success means users experience identical behavior and seamless data portability across macOS, Windows, and Linux.

**Data Consistency Requirements:**
- **Library synchronization:** Snippet libraries stored in standard config directories work identically across platforms
- **JSON format compatibility:** Library files are fully portable - export on Mac, import on Windows, zero data loss
- **File path handling:** Cross-platform path resolution for config directories (~/.config, %LOCALAPPDATA%) works reliably
- **Data integrity:** Zero data loss or corruption when moving libraries between platforms

**UI/UX Consistency Requirements:**
- **Visual consistency:** UI components render identically using ShadCN UI and Tailwind CSS across platforms
- **Keyboard shortcuts:** Same shortcuts work across platforms (Cmd on Mac = Ctrl on Windows/Linux)
- **Behavior consistency:** Search, drag-and-drop, tab stops, framework switching work identically
- **Native feel:** Despite cross-platform consistency, app respects platform conventions (window management, menus, dialogs)

**Performance Requirements:**
- **Search speed:** Sub-100ms fuzzy search response time across all platforms
- **App startup:** Under 2 seconds from launch to usable on all platforms
- **Snippet insertion:** Instant response (< 50ms) for drag-and-drop and tab stop insertion
- **Framework conversion:** Real-time conversion (< 200ms) when switching between frameworks

**Reliability Requirements:**
- **Data persistence:** Library changes saved immediately, no manual save required
- **Crash recovery:** Unsaved prompt composition recovers on restart
- **Cross-platform testing:** E2E tests pass on Mac, Windows, Linux before every release
- **Backward compatibility:** Library format versioning ensures future updates don't break existing libraries

**Developer Experience (Internal Technical Success):**
- **Build pipeline:** Single codebase builds for all three platforms via Tauri
- **Testing coverage:** 80%+ unit test coverage, E2E tests for critical paths on all platforms
- **Error handling:** Graceful degradation if platform-specific features unavailable
- **Logging/debugging:** Clear error messages and logging for troubleshooting platform-specific issues

### Measurable Outcomes

**First Week Success (User Validation):**
- User creates initial library with 5+ snippets
- User reuses at least one snippet within first 5 prompts
- User reports time savings or positive sentiment

**First Month Success (Engagement Validation):**
- Snippet reuse rate reaches 50%+ (growing toward 70% target)
- Library growth shows 10-15 snippets added
- User returns 3-4 days per week

**Sustained Success (Product-Market Fit):**
- 70%+ snippet reuse rate maintained
- Library growth plateaus (user has captured their expertise)
- User retention remains high (40%+ at 30 days)
- Users advocate for product (word-of-mouth, social sharing)

**Technical Success Validation:**
- Users move libraries between platforms with zero issues
- No platform-specific bug reports in critical paths
- Performance targets met across all platforms
- User feedback confirms "it works the same everywhere"

## Product Scope

### MVP - Minimum Viable Product

**Core Value Delivery: Eliminate prompt retyping through reusable snippet libraries**

**Must-Have Features (Cannot launch without):**

**1. Snippet Library Management**
- Create, edit, delete snippets (personas, guardrails, constraints)
- Organize by type/category (personas/, guardrails/, constraints/)
- JSON storage in standard config directories
- Basic search functionality (fuzzy matching by name)

**2. Three Framework Templates**
- RTF (Role-Task-Format) - 3 sections
- CODER (Context-Objective-Details-Examples-Response) - 5 sections  
- Co-Star (Context-Objective-Style-Tone-Audience-Response) - 6 sections
- Switch between frameworks (select from dropdown)
- Framework definitions with section descriptions

**3. Prompt Composition**
- Side-by-side layout: library panel + preview panel
- Drag-and-drop snippets into preview
- Manual editing in preview (freeform + structured hybrid)
- Copy to clipboard for pasting into LLM interfaces

**4. Keyboard-First Navigation**
- Cmd+K global search for snippets
- Basic keyboard shortcuts (Cmd+C copy, Cmd+S save template)
- Tab navigation between UI elements
- Arrow key navigation in search results

**5. Cross-Platform Foundation**
- Works on macOS, Windows, Linux (via Tauri v2)
- Library stored in platform-appropriate config directories
- Identical UI rendering via ShadCN UI + Tailwind CSS
- Same keyboard shortcuts (Cmd/Ctrl mapping)

**MVP Success Bar:**
- User can create library, compose prompts faster than typing manually, and experience time savings within first session
- Cross-platform library portability works reliably

**Explicitly OUT of MVP:**
- Search-enabled tab stops (complex UX, save for Growth phase)
- Framework conversion engine (RTF ↔ CODER ↔ Co-Star)
- Ghost text suggestions and quality indicators
- Template gallery with pre-filled examples
- Frecency ranking in search (basic fuzzy match sufficient for MVP)
- Atomic composition grammar (role + tech + architecture)
- Export/import library features
- Settings/customization (use sensible defaults)
- Vim mode or advanced keyboard shortcuts

### Growth Features (Post-MVP)

**Phase 2: Enhanced Composition & Learning**

Once MVP validates core value (time savings through snippet reuse), add:

**1. Search-Enabled Tab Stops (Novel UX Innovation)**
- Tab stops in framework templates trigger inline search
- Type to filter library snippets contextually
- Enter to insert, Cmd+Enter to insert multiple
- Novel hybrid: structured composition meets freeform speed

**2. Framework Conversion Engine**
- Convert prompts between RTF ↔ CODER ↔ Co-Star
- Experiment: "Does CODER work better for this task?"
- Educational: Users learn framework differences through usage

**3. Education Through Usage**
- Ghost text suggestions (show complete persona examples)
- Quality indicators (completeness scores, missing sections)
- Context-aware hints (boost C#-related snippets if C# persona selected)
- Passive pedagogy without blocking workflow

**4. Advanced Search & Discovery**
- Frecency ranking (frequently + recently used items surface first)
- Category filtering (Cmd+1/2/3 for personas/guardrails/constraints)
- Usage analytics (show most-used snippets, suggest reuse)

**5. Template Gallery**
- Pre-filled example prompts (code refactoring, blog posts, documentation)
- One-click "Use as template" with placeholders
- Learn by example through real prompts

**6. Atomic Composition Grammar**
- Sub-component composition: "Senior Developer" + "C#" + "IDesign" = persona
- Combinatorial power: 5 roles × 20 techs × 10 architectures = 1000 personas
- Template slots: "You are a {ROLE} specializing in {TECHNOLOGY}"

**7. Library Import/Export**
- Export library as JSON for backup or sharing
- Import community libraries or teammates' collections
- Version control friendly (Git-compatible JSON format)

### Vision (Future)

**Phase 3: Community & Intelligence**

Long-term vision features (12+ months):

**1. Custom Framework Creator**
- Users define their own framework templates
- Section definitions, validation rules, examples
- Share custom frameworks with community

**2. Team Collaboration**
- Shared team libraries
- Project-scoped snippet collections
- Commenting and versioning on snippets

**3. AI-Powered Enhancements**
- Automatic snippet suggestions based on prompt content
- Quality scoring with explanations ("add examples to improve clarity")
- Snippet extraction from pasted text ("I see 3 personas here - save them?")

**4. Multi-Prompt Projects**
- Prompt chains and workflows
- Version history and A/B testing
- Analytics: which prompts performed best

**5. Community Marketplace**
- Browse and download community framework templates
- Share snippet libraries publicly
- Upvote/comment on popular frameworks and snippets

**6. LLM Integration**
- Direct integration with LLM providers (OpenAI, Anthropic, local models)
- Send prompts directly from app, see results inline
- Prompt effectiveness tracking based on actual LLM responses

## User Journeys

### Journey 1: Alex Chen - Reclaiming Development Flow

Alex is a senior full-stack developer who's been using Cursor and Claude Desktop heavily for the past six months. Every time they start a new coding session, Alex types out the same setup: "You are a senior C# developer with expertise in IDesign architecture. Follow these constraints: No external dependencies, Windows-compatible solutions only, include unit tests with every implementation." It takes 2-3 minutes each time, and Alex does this 10-15 times per day across different agent sessions.

The frustration peaks one Friday afternoon when Alex realizes they've spent nearly 30 minutes that day just retyping persona and constraint boilerplate. They think, "There has to be a better way" and goes searching for prompt management tools. Most are web-based SaaS tools that feel slow and require a mouse. Then Alex discovers Prompt Alchemist - a desktop app with keyboard shortcuts.

Within 20 minutes, Alex has built their core library: a "Senior C# Developer" persona, "IDesign Architecture" context snippet, their standard guardrails ("No deps", "Windows-only"), and common response formats. The next morning, Alex opens a new Cursor session, hits Cmd+K in Prompt Alchemist, types "sen c# ide", hits Enter three times (persona, architecture, guardrails), presses Cmd+C, and pastes into Cursor. **Total time: 12 seconds instead of 2 minutes.**

Three weeks later, Alex's library has grown to 25 snippets covering their entire tech stack. Their snippet reuse rate is 85% - they compose prompts in under 30 seconds consistently. Alex calculates they're saving 2 hours per week, which means 8 hours per month of pure development time reclaimed. When a coworker asks "How are your LLM prompts so consistent?", Alex shares their Prompt Alchemist library export. Alex has become an evangelist.

### Journey 2: Sam Martinez - Learning Prompt Engineering

Sam is a mid-level developer who started using ChatGPT for code help three months ago. Their prompts are hit-or-miss: sometimes they get exactly what they need, other times the responses are vague or miss the mark entirely. Sam doesn't understand why - they just type what comes to mind.

One day, a colleague mentions "structured prompts" and Sam googles it, finding Prompt Alchemist. The first time Sam opens the app, they see the RTF framework (Role-Task-Format) with example templates. Sam clicks "Code Refactoring Template" and sees a pre-filled prompt: clear role definition, specific task description, desired output format. It's a revelation - "Oh, THAT'S why my prompts are inconsistent."

Sam starts using the CODER framework (Context-Objective-Details-Examples-Response) for technical tasks. As Sam types, ghost text suggests completions: "Add examples to improve clarity" appears when the Examples section is empty. Quality indicators show "4/5 sections complete." Sam isn't being lectured - the tool is gently showing what makes prompts effective.

Six weeks later, Sam is writing better prompts even without the tool. The frameworks have become internalized. When debugging a tricky issue, Sam naturally thinks: "Context: what have I tried? Objective: what do I need? Details: what constraints matter?" Prompt Alchemist taught Sam prompt engineering **by using it**, not by reading docs. Sam's LLM results are now consistent, and they've started building a snippet library of their own patterns.

### Journey 3: Jamie Foster - First Steps with LLMs

Jamie is a junior developer fresh out of bootcamp who keeps hearing about "using AI for coding" but feels overwhelmed. They've opened ChatGPT a few times but their prompts produce generic, unhelpful responses. Jamie types things like "make this code better" and gets vague suggestions that don't compile.

A senior developer on Jamie's team recommends Prompt Alchemist, saying "it'll teach you how to talk to LLMs properly." Jamie installs it nervously, unsure what to expect. The app opens with a framework comparison screen: RTF (simplest), CODER (for code), Co-Star (for content). Jamie clicks "What's RTF?" and sees: "Role-Task-Format: Tell the AI who they are, what to do, and how to respond. Perfect for beginners."

Jamie selects RTF and creates their first structured prompt. The template has helpful tooltips: "Role: Define who the AI should act as (example: 'You are an experienced Python developer')" and "Task: Describe exactly what you need (be specific!)". Jamie fills it out: Role = "Python developer", Task = "Refactor this function to be more readable", Format = "Show the refactored code with comments explaining changes."

The result from ChatGPT is dramatically better - clear, specific, actually helpful. Jamie realizes the problem wasn't the AI, it was **how they were asking**. Over the next month, Jamie explores all three frameworks, builds a small library of personas and constraints, and their confidence with LLMs grows. They're no longer intimidated - they're empowered.

### Journey Requirements Summary

These three journeys reveal the following capability areas needed:

**Core Library & Composition (All Journeys):**
- Snippet library management (create, edit, organize personas/guardrails/constraints)
- Three framework templates (RTF, CODER, Co-Star) with section definitions
- Side-by-side composition (library panel + preview with manual editing)
- Copy to clipboard for LLM interfaces
- JSON storage in config directories with cross-platform support

**Keyboard-First Speed (Alex - Power User):**
- Cmd+K global search with fuzzy matching
- Fast insertion workflow (search → select → insert in under 15 seconds)
- Keyboard shortcuts for all major actions
- Instant snippet reuse without mouse interaction

**Education & Guidance (Sam - Casual User):**
- Framework comparison and selection guidance
- Example template gallery with pre-filled prompts
- Ghost text suggestions (show what complete prompts look like)
- Quality indicators (section completeness, suggestions)
- Learn-by-doing approach without blocking workflow

**Beginner Onboarding (Jamie - Complete Beginner):**
- Framework explanation and "What's this?" help content
- Section tooltips explaining purpose and showing examples
- Pre-filled template examples to learn from
- Clear visual feedback on prompt structure
- Progressive disclosure (simple by default, advanced features discoverable)

**Cross-Cutting Requirements:**
- Snippet reuse tracking (measure 70%+ reuse rate for engagement)
- Library growth analytics (track plateau as expertise captured)
- Cross-platform consistency (Mac, Windows, Linux identical experience)
- Data portability (export/import libraries between machines)


## Desktop App Specific Requirements

### Project-Type Overview

Prompt Alchemist is a **cross-platform desktop application** built with Tauri v2, optimized for native performance and offline operation. As a developer tool, it prioritizes keyboard-first interaction, fast startup, and seamless integration with the local file system.

### Technical Architecture Considerations

**Cross-Platform Foundation:**
- **Supported Platforms:** macOS, Windows, Linux
- **Technology Stack:** Tauri v2 (Rust backend) + React 19 (frontend)
- **UI Framework:** ShadCN UI + Tailwind CSS v4 for consistent cross-platform rendering
- **Build Pipeline:** Single codebase builds for all three platforms via Tauri CLI

**Platform-Specific Adaptations:**
- **Keyboard Shortcuts:** Cmd on macOS automatically maps to Ctrl on Windows/Linux
- **Config Directories:** 
  - macOS/Linux: `~/.config/prompt-alchemist/`
  - Windows: `%LOCALAPPDATA%\prompt-alchemist\`
- **Window Management:** Respect platform conventions (title bar, menus, close behavior)
- **Native Dialogs:** Use platform-native file pickers and confirmation dialogs where appropriate

### Platform Support Requirements

**macOS:**
- Minimum version: macOS 10.15 (Catalina) or later
- Apple Silicon (M1/M2/M3) and Intel support
- Code signing and notarization for distribution (post-MVP)

**Windows:**
- Minimum version: Windows 10 (64-bit)
- Windows 11 compatibility
- Installer format: MSI or NSIS (post-MVP, initial releases as portable executable)

**Linux:**
- Distribution formats: AppImage (primary), .deb (Ubuntu/Debian), .rpm (Fedora/RHEL)
- Minimum glibc version compatibility
- Desktop integration (.desktop file for app launcher)

### System Integration

**File System Access:**
- **Library Storage:** Read/write access to platform-specific config directories
- **Permissions:** No elevated privileges required (user-space only)
- **Data Format:** JSON files for snippet library, human-readable for troubleshooting
- **Backup Strategy:** Users can manually copy config directory for backup (no built-in backup in MVP)

**Clipboard Integration:**
- **Copy Functionality:** One-click copy composed prompts to system clipboard
- **Paste Detection:** Optional paste detection from clipboard into preview pane (post-MVP)
- **Format:** Plain text markdown for maximum LLM compatibility

**Keyboard Shortcuts:**
- **Global Shortcuts:** None in MVP (app must be focused)
- **App-Level Shortcuts:** Cmd/Ctrl+K (search), Cmd/Ctrl+C (copy), Cmd/Ctrl+S (save), Tab/Shift+Tab (navigation)
- **Customization:** Fixed shortcuts in MVP, customizable in post-MVP

**No Additional System Integration Required:**
- No system tray icon (full window app only)
- No global hotkeys (app must be in focus)
- No system notifications
- No context menu integration
- No file type associations

### Update Strategy

**MVP Approach: Manual Updates**
- **Distribution:** GitHub Releases with versioned binaries for each platform
- **Update Check:** No automatic update checking in MVP
- **User Notification:** Release announcements via GitHub, project website, or community channels
- **Installation:** Users manually download and replace application binary

**Rationale:**
- Simplifies MVP implementation (no update infrastructure needed)
- Reduces complexity and potential failure points
- Aligns with developer tool expectations (developers comfortable with manual updates)
- GitHub Releases provides reliable, free distribution platform

**Post-MVP: Tauri Updater Investigation**
- Evaluate Tauri's built-in updater for automatic updates
- Consider update frequency, user control (prompt vs auto), and rollback mechanisms
- Implement if user feedback indicates strong need for automatic updates

### Offline Capabilities

**Fully Offline Operation:**
- **No Internet Required:** Application functions completely without network connectivity
- **Local Storage Only:** All snippet libraries, settings, and prompts stored locally on user's machine
- **No Cloud Dependencies:** No API calls, no telemetry, no analytics, no authentication servers

**Data Portability:**
- **Manual Export/Import:** Users can copy config directory to move libraries between machines
- **Git-Friendly Format:** JSON library files can be version-controlled if user chooses
- **No Sync Service:** No automatic cloud sync in MVP (users manage their own backup/sync if desired)

**Post-MVP Online Features (Optional Exploration):**
- Template marketplace (browse/download community frameworks)
- Library sharing (export/import via URL or file)
- Community snippet collections
- All optional - core app remains fully functional offline

### Implementation Considerations

**Desktop App Best Practices:**
- **Fast Startup:** Target < 2 seconds from launch to usable (cold start)
- **Low Memory Footprint:** Keep baseline memory usage under 100MB
- **Native Feel:** Respect platform UI conventions (menu bars, keyboard shortcuts, window behavior)
- **Window State Persistence:** Remember window size, position, and layout preferences across sessions
- **Graceful Degradation:** Handle missing permissions or file system errors without crashes

**Development Workflow:**
- **Hot Reload:** Use `npm run tauri:dev` for development with fast refresh
- **Cross-Platform Testing:** Test on all three platforms before releases (VM or CI/CD)
- **Platform-Specific Bugs:** Track and fix platform-specific issues separately
- **Build Artifacts:** Generate separate binaries for each platform

**Security Considerations:**
- **Sandboxing:** Leverage Tauri's security features (IPC validation, command allowlisting)
- **File System Access:** Limit to config directory only (no arbitrary file system access)
- **No Sensitive Data:** Snippets are plain text (no encryption needed for MVP)
- **User Privacy:** No telemetry, no network requests, no data collection


## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Problem-Solving MVP**

Prompt Alchemist follows a **problem-solving MVP** strategy focused on eliminating prompt fatigue through reusable snippet libraries. The MVP delivers immediate, measurable value (2+ hours saved per week) without requiring complex educational features or advanced UX innovations.

**Strategic Rationale:**
- **Fast time-to-value:** Users experience time savings in their first session
- **Clear success metric:** 70%+ snippet reuse rate validates product-market fit
- **Lean scope:** Core library + framework + composition functionality only
- **Foundation for growth:** MVP validates core value before investing in advanced features (search-enabled tab stops, framework conversion, education systems)

**Resource Requirements:**
- **Team Size:** 1-3 developers (solo founder viable)
- **Skills Needed:** TypeScript/React, Rust/Tauri, cross-platform desktop development
- **Timeline:** 3-6 months to MVP launch (depending on team size and complexity)
- **Infrastructure:** Minimal (GitHub for distribution, no backend/cloud dependencies)

### MVP Feature Set (Phase 1)

**Reference:** See "MVP - Minimum Viable Product" section in Product Scope above for complete feature list.

**Core User Journeys Supported:**
- **Alex Chen (Power User):** Keyboard-first snippet composition with Cmd+K search, drag-and-drop, and clipboard copy
- **Jamie Foster (Beginner):** Framework selection (RTF, CODER, Co-Star) with section descriptions and tooltip guidance
- **Partial support for Sam Martinez:** Frameworks provide structure, but advanced educational features (ghost text, quality indicators) deferred to Phase 2

**Must-Have Capabilities:**

1. **Snippet Library Management**
   - Create, edit, delete snippets (personas, guardrails, constraints)
   - JSON storage in config directories
   - Basic fuzzy search by name

2. **Three Framework Templates**
   - RTF (3 sections), CODER (5 sections), Co-Star (6 sections)
   - Framework dropdown selection
   - Section descriptions for each framework

3. **Prompt Composition**
   - Side-by-side layout (library + preview)
   - Drag-and-drop snippets
   - Manual freeform editing in preview
   - Copy to clipboard

4. **Keyboard-First Navigation**
   - Cmd+K global search
   - Basic shortcuts (Cmd+C, Cmd+S, Tab navigation)
   - Arrow key navigation in search results

5. **Cross-Platform Foundation**
   - macOS, Windows, Linux builds via Tauri v2
   - Identical UI rendering (ShadCN UI + Tailwind CSS)
   - Platform-appropriate config directories

**MVP Success Bar:**
- User creates library and experiences time savings within first session (< 30 minutes to value)
- Prompts composed in 30 seconds vs 2-5 minutes manual typing
- Cross-platform library portability works reliably (export JSON, import elsewhere, zero data loss)

**Explicitly OUT of MVP:**
- Search-enabled tab stops (defer to Phase 2 - complex UX innovation)
- Framework conversion engine (defer to Phase 2 - requires mapping logic)
- Ghost text, quality indicators, educational features (defer to Phase 2)
- Template gallery with examples (defer to Phase 2)
- Frecency ranking (basic fuzzy search sufficient for MVP)
- Atomic composition grammar (defer to Phase 2)
- Export/import UI (manual config directory copy sufficient for MVP)
- Settings/customization (use sensible defaults)

### Post-MVP Features

**Phase 2 (Growth): Enhanced Composition & Learning**

**Reference:** See "Growth Features (Post-MVP)" section in Product Scope above for complete feature list.

**Trigger for Phase 2:** MVP validates core value proposition
- 100+ active users with 70%+ snippet reuse rate at 3 months
- Positive user feedback on time savings
- Users requesting advanced features from roadmap

**Phase 2 Focus Areas:**
1. **Search-Enabled Tab Stops** - Novel UX innovation combining tab stops + inline search
2. **Framework Conversion** - Switch between RTF ↔ CODER ↔ Co-Star to experiment
3. **Education Through Usage** - Ghost text, quality indicators, context-aware hints
4. **Advanced Search** - Frecency ranking, category filtering, usage analytics
5. **Template Gallery** - Pre-filled examples for learning
6. **Atomic Composition** - Sub-component snippets (role + tech + architecture)
7. **Library Import/Export UI** - Built-in export/import vs manual config directory

**Timeline:** 3-6 months post-MVP launch

**Phase 3 (Expansion): Community & Intelligence**

**Reference:** See "Vision (Future)" section in Product Scope above for complete feature list.

**Trigger for Phase 3:** Strong product-market fit established
- 500+ active users, high retention (40%+ at 30 days)
- Community engagement and word-of-mouth growth
- Users sharing libraries and requesting collaboration features

**Phase 3 Focus Areas:**
1. **Custom Framework Creator** - User-defined frameworks
2. **Team Collaboration** - Shared libraries, project-scoped collections
3. **AI-Powered Enhancements** - Auto-suggestions, quality scoring, snippet extraction
4. **Multi-Prompt Projects** - Chains, version history, A/B testing
5. **Community Marketplace** - Browse/download frameworks and snippets
6. **LLM Integration** - Direct send to LLM providers, inline results

**Timeline:** 12+ months post-MVP launch

### Risk Mitigation Strategy

**Technical Risks:**

**Risk 1: Cross-Platform Consistency Challenges**
- **Mitigation:** Leverage Tauri v2's proven cross-platform capabilities, use ShadCN UI for consistent rendering
- **Validation:** E2E tests on all three platforms before every release
- **Contingency:** If platform-specific issues emerge, prioritize macOS first (primary developer platform), then Windows, then Linux

**Risk 2: Search Performance at Scale**
- **Mitigation:** Basic fuzzy search sufficient for MVP (most users will have < 100 snippets)
- **Validation:** Performance testing with 1000+ snippet libraries
- **Contingency:** Implement indexing or lazy loading if search becomes slow

**Risk 3: Framework Conversion Complexity (Phase 2)**
- **Mitigation:** Defer to Phase 2, validate MVP first
- **Validation:** Research framework mapping logic during MVP phase
- **Contingency:** Ship Phase 2 without conversion if mapping proves too complex

**Market Risks:**

**Risk 1: Users Don't Adopt Structured Frameworks**
- **Mitigation:** MVP supports freeform editing alongside frameworks (hybrid approach)
- **Validation:** Track framework usage vs freeform in analytics
- **Contingency:** If users prefer freeform, pivot to pure snippet manager with optional framework templates

**Risk 2: Insufficient Time Savings to Justify Adoption**
- **Mitigation:** Target 2+ hours saved per week - clear, measurable value
- **Validation:** User surveys and self-reported time savings
- **Contingency:** If time savings don't materialize, investigate friction points (search speed, snippet creation UX)

**Risk 3: Competition from Existing Tools**
- **Mitigation:** Differentiate through desktop-first, keyboard-first, offline capabilities
- **Validation:** User feedback on what competitors lack
- **Contingency:** Double down on education-through-usage differentiator (Phase 2)

**Resource Risks:**

**Risk 1: Solo Developer Bandwidth**
- **Mitigation:** Ruthlessly lean MVP scope (no education features, no framework conversion)
- **Validation:** MVP feature set completable in 3-6 months solo
- **Contingency:** If timeline slips, cut frameworks to RTF only initially, add CODER/Co-Star in 1.1

**Risk 2: Cross-Platform Testing Overhead**
- **Mitigation:** Automated E2E tests with Playwright on all platforms
- **Validation:** CI/CD pipeline runs tests on Mac/Windows/Linux
- **Contingency:** If CI too expensive, prioritize macOS manual testing, rely on community for Windows/Linux bug reports

**Risk 3: Manual Update Distribution Friction**
- **Mitigation:** Clear release notes, GitHub Releases for visibility
- **Validation:** Monitor download counts and user complaints
- **Contingency:** If users demand auto-update, investigate Tauri updater in Phase 1.5 (pre-Phase 2)

### Scope Decision Summary

**MVP Boundaries Locked:**
- Core library + 3 frameworks + basic composition + keyboard navigation + cross-platform
- Estimated 3-6 months solo or 2-3 months with small team
- Success = 100 users, 70%+ reuse rate, 2+ hours saved/week

**Phase 2 Triggers:**
- MVP success metrics hit (user adoption, engagement, retention)
- User demand for educational features and advanced UX

**Phase 3 Triggers:**
- Strong product-market fit (500+ users, high retention)
- Community momentum and collaboration requests

**Strategic Flexibility:**
- If solo development timeline slips: Cut to RTF framework only, add others in 1.1
- If cross-platform too complex: Ship macOS first, Windows/Linux in rapid follow-up
- If users ignore frameworks: Pivot to snippet manager with optional templates

## Functional Requirements

### Snippet Library Management

- **FR1:** Users can create new snippets with a name, type (persona/guardrail/constraint), and content
- **FR2:** Users can edit existing snippets (modify name, type, or content)
- **FR3:** Users can delete snippets from their library
- **FR4:** Users can organize snippets by type/category (personas, guardrails, constraints)
- **FR5:** Users can view their complete snippet library in a browsable list
- **FR6:** System stores snippet library in JSON format in platform-specific config directories

### Framework Management

- **FR7:** Users can select from three framework templates (RTF, CODER, Co-Star)
- **FR8:** Users can view framework descriptions explaining each framework's purpose and sections
- **FR9:** System displays RTF framework with 3 sections (Role, Task, Format)
- **FR10:** System displays CODER framework with 5 sections (Context, Objective, Details, Examples, Response)
- **FR11:** System displays Co-Star framework with 6 sections (Context, Objective, Style, Tone, Audience, Response)
- **FR12:** Users can switch between frameworks during prompt composition

### Prompt Composition

- **FR13:** Users can compose prompts using a side-by-side layout (library panel + preview panel)
- **FR14:** Users can drag and drop snippets from library into preview panel
- **FR15:** Users can manually edit prompt content directly in preview panel (freeform text editing)
- **FR16:** Users can see selected framework sections displayed in preview panel
- **FR17:** Users can combine structured framework sections with freeform editing
- **FR18:** System displays composed prompt content in real-time as users add snippets or type

### Search & Discovery

- **FR19:** Users can search snippets using Cmd+K global search shortcut
- **FR20:** System performs fuzzy matching on snippet names during search
- **FR21:** Users can navigate search results using arrow keys
- **FR22:** Users can insert selected snippet from search results into prompt by pressing Enter
- **FR23:** System filters library by snippet type/category when browsing

### Clipboard & Export

- **FR24:** Users can copy composed prompts to system clipboard with Cmd+C or copy button
- **FR25:** System exports prompts as plain text markdown format for LLM compatibility
- **FR26:** Users can paste copied prompts into external LLM tools (Cursor, ChatGPT, Claude Desktop)

### Cross-Platform Desktop Functionality

- **FR27:** Application runs natively on macOS (10.15 Catalina or later)
- **FR28:** Application runs natively on Windows (10 64-bit or later)
- **FR29:** Application runs natively on Linux (via AppImage, .deb, or .rpm)
- **FR30:** System maps Cmd shortcuts on macOS to Ctrl shortcuts on Windows/Linux automatically
- **FR31:** System stores library in `~/.config/prompt-alchemist/` on macOS/Linux
- **FR32:** System stores library in `%LOCALAPPDATA%\prompt-alchemist\` on Windows
- **FR33:** Application functions completely offline without internet connectivity
- **FR34:** Users can manually copy config directory to move libraries between machines
- **FR35:** System persists window size, position, and layout preferences across sessions
- **FR36:** Application starts and becomes usable within 2 seconds (cold start target)

### Keyboard-First Navigation

- **FR37:** Users can trigger global search with Cmd+K (macOS) or Ctrl+K (Windows/Linux)
- **FR38:** Users can copy composed prompt with Cmd+C (macOS) or Ctrl+C (Windows/Linux)
- **FR39:** Users can save prompt template with Cmd+S (macOS) or Ctrl+S (Windows/Linux)
- **FR40:** Users can navigate between UI panels using Tab and Shift+Tab keys
- **FR41:** Users can navigate search results using Up/Down arrow keys
- **FR42:** Users can perform all core actions without mouse interaction

## Non-Functional Requirements

### Performance

**Search Performance:**
- **NFR-P1:** Snippet search returns results within 100ms for libraries up to 1,000 snippets
- **NFR-P2:** Fuzzy matching algorithm completes within 50ms on average user libraries (50-100 snippets)

**Application Responsiveness:**
- **NFR-P3:** Application cold start completes within 2 seconds from launch to usable state
- **NFR-P4:** Snippet drag-and-drop insertion responds within 50ms (perceived as instant)
- **NFR-P5:** Framework switching updates UI within 200ms
- **NFR-P6:** Keyboard shortcuts (Cmd+K, Cmd+C, Tab navigation) respond within 100ms

**Resource Efficiency:**
- **NFR-P7:** Application baseline memory usage remains under 100MB during idle state
- **NFR-P8:** Application memory usage remains under 200MB during active composition with large libraries (500+ snippets)

### Reliability

**Data Persistence:**
- **NFR-R1:** Library changes are saved immediately upon user action (no manual save required)
- **NFR-R2:** Application recovers unsaved prompt composition content after unexpected crash or restart
- **NFR-R3:** JSON library files maintain integrity across application crashes (atomic writes, no corruption)
- **NFR-R4:** Library format versioning prevents data loss when upgrading to newer application versions

**Cross-Platform Consistency:**
- **NFR-R5:** Library exported from one platform (e.g., macOS) imports with zero data loss on another platform (e.g., Windows, Linux)
- **NFR-R6:** All core functional requirements (FR1-FR42) behave identically across macOS, Windows, and Linux
- **NFR-R7:** E2E test suite passes on all three platforms (Mac, Windows, Linux) before every release

**Error Handling:**
- **NFR-R8:** Application handles file system errors gracefully (missing config directory, read/write permissions) without crashing
- **NFR-R9:** Application displays clear, actionable error messages when operations fail (e.g., "Cannot save library: permission denied. Check folder permissions.")

### Usability

**Keyboard-First Navigation:**
- **NFR-U1:** All core user workflows (create snippet, search, compose, copy) are completable without mouse interaction
- **NFR-U2:** Keyboard shortcuts follow platform conventions (Cmd on macOS maps to Ctrl on Windows/Linux)
- **NFR-U3:** Keyboard shortcut discoverability: All shortcuts displayed in tooltips, menus, or help documentation

**Learning Curve:**
- **NFR-U4:** New users can create their first snippet and compose a prompt within 5 minutes of first launch
- **NFR-U5:** Framework selection provides clear descriptions explaining purpose and use cases (RTF vs CODER vs Co-Star)
- **NFR-U6:** Search results display snippet type/category to aid selection during composition

**Composition Speed:**
- **NFR-U7:** Power users can compose prompts in under 30 seconds using Cmd+K search and keyboard insertion (vs 2-5 minutes manual typing)
- **NFR-U8:** Application does not require mode switching between structured framework composition and freeform editing

### Accessibility

**Keyboard Navigation:**
- **NFR-A1:** All interactive elements are keyboard-accessible using Tab, Shift+Tab, Enter, Escape, and Arrow keys
- **NFR-A2:** Keyboard focus indicators are visible and meet WCAG 2.1 AA contrast requirements (3:1 minimum)
- **NFR-A3:** Focus order follows logical visual flow (left-to-right, top-to-bottom in Western locales)
- **NFR-A4:** Keyboard shortcuts do not conflict with screen reader shortcuts (avoid single-key shortcuts without modifier keys)

**Screen Reader Support:**
- **NFR-A5:** All UI elements have appropriate ARIA labels, roles, and states for screen reader compatibility
- **NFR-A6:** Dynamic content changes (search results, snippet insertion, framework switching) announce to screen readers using ARIA live regions
- **NFR-A7:** Application is navigable and usable with VoiceOver (macOS), NVDA (Windows), and Orca (Linux)
- **NFR-A8:** Snippet library items announce type/category and content when focused by screen readers

**Visual Accessibility:**
- **NFR-A9:** All text meets WCAG 2.1 AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text)
- **NFR-A10:** UI does not rely solely on color to convey information (use icons, labels, or patterns as secondary indicators)
- **NFR-A11:** User interface supports browser/OS zoom up to 200% without loss of functionality
- **NFR-A12:** Framework sections and snippet categories are distinguishable through visual hierarchy beyond color alone

**Interaction Accessibility:**
- **NFR-A13:** All clickable targets meet minimum size requirements (44x44px for touch, 24x24px for pointer as per WCAG 2.1 AA)
- **NFR-A14:** Drag-and-drop functionality has keyboard-equivalent alternatives (e.g., select snippet + Enter to insert)
- **NFR-A15:** Search filtering provides clear feedback on number of results and current selection state
- **NFR-A16:** Error messages and validation feedback are announced to screen readers and visible in UI

**Reduced Motion:**
- **NFR-A17:** Application respects `prefers-reduced-motion` system setting, disabling non-essential animations
- **NFR-A18:** Framework switching and snippet insertion transitions are optional or instantaneous when reduced motion is enabled

**Testing & Validation:**
- **NFR-A19:** Application passes automated accessibility testing (e.g., axe-core, Lighthouse accessibility audits) with zero critical violations
- **NFR-A20:** Manual keyboard-only navigation testing completed for all core workflows before each release
- **NFR-A21:** Screen reader testing with at least one platform's screen reader (VoiceOver, NVDA, or Orca) completed before major releases

### Compatibility

**Cross-Platform Rendering:**
- **NFR-C1:** UI components render visually identically across macOS, Windows, and Linux using ShadCN UI and Tailwind CSS
- **NFR-C2:** Application respects platform-specific window management conventions (title bar, menus, close behavior)

**Data Portability:**
- **NFR-C3:** Library files stored in JSON format are human-readable and Git-compatible (version control friendly)
- **NFR-C4:** Config directory locations follow platform standards:
  - macOS/Linux: `~/.config/prompt-alchemist/`
  - Windows: `%LOCALAPPDATA%\prompt-alchemist\`
- **NFR-C5:** Library JSON schema is backward compatible (older libraries work with newer app versions)

**Clipboard Compatibility:**
- **NFR-C6:** Copied prompts are plain text markdown format compatible with all major LLM interfaces (Cursor, ChatGPT, Claude Desktop, VSCode)
- **NFR-C7:** Clipboard operations work identically across all supported platforms

**Platform Version Support:**
- **NFR-C8:** Application runs on macOS 10.15 (Catalina) or later, supporting both Intel and Apple Silicon
- **NFR-C9:** Application runs on Windows 10 (64-bit) or later, including Windows 11
- **NFR-C10:** Application runs on Linux distributions via AppImage, .deb (Ubuntu/Debian), and .rpm (Fedora/RHEL)
