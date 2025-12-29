---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'Prompt engineering desktop tool with template frameworks and reusable snippet libraries'
session_goals: 'Template-driven prompt creation, reusable snippet library system, import/export functionality, modular library management, desktop-first UX'
selected_approach: 'AI-Recommended Techniques'
techniques_used: ['Morphological Analysis', 'Analogical Thinking', 'Alien Anthropologist']
ideas_generated: 50
context_file: '_bmad/bmm/data/project-context-template.md'
session_complete: true
---

# Brainstorming Session Results

**Facilitator:** Timothygoshinski
**Date:** 2025-12-27

## Session Overview

**Topic:** A desktop application (React + Tauri) that helps developers write well-structured LLM prompts using best-in-class frameworks (Automat, Co-Star) combined with a library system for reusable prompt snippets and personas.

**Goals:**
1. Template-driven prompt creation - Guide users to write effective prompts using proven frameworks
2. Reusable snippet library - Build collections of personas, context snippets, and constraints
3. Import/Export functionality - Share libraries in human-readable formats (JSON)
4. Modular library management - Import/export partial or complete libraries
5. Desktop-first UX - Leverage Tauri + React for native-feeling experience

### Context Guidance

This session focuses on software product development with emphasis on:
- User problems and pain points in prompt engineering
- Feature ideas for template frameworks and library management
- Technical approaches for React + Tauri architecture
- User experience for desktop prompt tooling
- Market differentiation in the LLM tools space

Results will feed into Product Briefs, PRDs, and Technical Specifications for the Prompt Alchemist project.

### Session Setup

**Innovation Areas to Explore:**
- Making template frameworks intuitive and discoverable
- Library organization and categorization strategies
- Snippet composition and combination patterns
- Import/export workflows and formats
- Desktop-specific UX advantages over web tools

---

## Technique Selection

**Approach:** AI-Recommended Techniques  
**Analysis Context:** Prompt engineering desktop tool with focus on template-driven creation and library management

**Recommended Technique Sequence:**

### Phase 1: Foundation Setting (15-20 min)
**Morphological Analysis** (Deep Thinking)
- Systematically explore all parameter combinations for template systems, library structures, and data formats
- Expected outcome: Comprehensive matrix revealing optimal feature pairings

### Phase 2: Creative Exploration (20-25 min)
**Analogical Thinking** (Creative Methods)
- Transfer successful patterns from analogous tools (VSCode snippets, Figma components, Postman collections)
- Expected outcome: 5-10 proven UX patterns and technical architectures adapted to prompt engineering

### Phase 3: Validation & Refinement (15-20 min)
**Alien Anthropologist** (Theatrical Methods)
- Examine tool through completely foreign eyes to identify hidden assumptions
- Expected outcome: UX improvements and onboarding clarity for broader audience

**AI Rationale:** This sequence balances systematic technical analysis with creative pattern transfer and user-centered validation - addressing both the architectural complexity and UX challenges of building a prompt engineering tool for developers.

---

## Phase 1: Morphological Analysis Results

**Technique Status:** ✅ Completed

### Key Parameters Explored

**P1: Help System** → Inline contextual with user-controlled toggle
- Respects developer mastery, non-intrusive
- User decides when to hide help per section

**P2: Library Model** → Global atomic personal library with project-scoped saving (Phase 2)
- MVP: Personal global library in standard config directories (~/.config or %LOCALAPPDATA%)
- Atomic snippets: Personas (role + tech + architecture), guardrails, constraints
- Sub-component composition: "Senior Developer" + "C#" + "IDesign" = composed persona
- Save compositions for reuse within projects

**P3: Composition UI** → Slot-based template builder with atomic composition grammar
- Templates like: "You are a {ROLE} specializing in {TECHNOLOGY} with {ARCHITECTURE} expertise"
- Fills slots from atomic library → generates natural language
- Combinatorial power: 5 roles × 20 techs × 10 architectures = 1000 personas from 35 atoms

**P4: Discovery** → Search-first MVP (Cmd+K pattern)
- Lean approach: Ship search-first, let usage data guide enhancement
- Developer muscle memory leveraged
- Future: Adaptive organization based on user behavior

**P5: Template Frameworks** → Multi-framework with switching capability
- Support both Automat and Co-Star frameworks
- **Game-changer:** Convert between frameworks to experiment
- Same atomic data, different template views

**P6: Data Format** → JSON storage / Markdown export
- JSON for atomic storage and parsing reliability
- Markdown for LLM consumption and human readability
- Round-trip capable: Markdown → JSON → Edit → Markdown

**P7: Desktop Integration** → Standard config directory + clipboard integration
- Cross-platform: ~/.config (Mac/Linux), %LOCALAPPDATA% (Windows)
- Clipboard paste into preview for context addition
- Library stored in filesystem (no project complexity in MVP)

**P8: Preview Mode** → Side-by-side editable with configurable layout
- Left panel: Draggable library snippets
- Right panel: Live editable Markdown preview
- Configurable: Swap sides for developer/cultural preferences
- Hybrid: Structured drag-and-drop + freeform editing for ad-hoc task sections

**P9: Training Approach** → Unobtrusive indicators and passive learning
- Quality indicators (completeness scores, suggestions)
- Pattern recognition hints (non-blocking)
- Example-based learning (expandable, dismissible)
- Post-usage reflection (save templates, extract snippets)

### Powerful Combination Discoveries

**Combination Alpha: Framework Switching + Quality Indicators**
- Build in Co-Star (4/6 complete) → Switch to Automat → See "Automat has all required fields ✅"
- Training: Users learn which framework fits their prompt style

**Combination Beta: Clipboard Paste + Snippet Extraction**
- Paste text → Tool offers to decompose into atomic snippets
- Training: Users learn atomic thinking through decomposition examples

**Combination Gamma: Drag-and-Drop + Live Markdown Preview**
- Drag persona → Instant formatted Markdown preview
- Training: Learn by example with every composition

**Combination Delta: Search + Usage Analytics + Quality Hints**
- Search results show: "Senior C# + IDesign ⭐ (Used 15 times, 92% quality prompts)"
- Training: Usage data becomes quality feedback loop

### Core Product Insights

1. **Hybrid Tool:** Structured library + freeform editor working together
2. **Passive Pedagogy:** Teach through usage, never block workflow
3. **Lean MVP Scope:** Personal library first, project integration Phase 2
4. **Atomic Power:** Small composable pieces create complex prompts
5. **Secret Weapon:** Framework switching as experimentation/learning tool

### Technical Architecture Decisions

- Global library structure: personas/, guardrails/, constraints/
- Atomic composition with grammar templates
- JSON internal format, Markdown export format
- Cross-platform config directory storage
- Drag-and-drop React components with live preview
- Framework conversion engine (Co-Star ↔ Automat)

---

## Phase 2: Analogical Thinking Results

**Technique Status:** ✅ Completed

### Tools Analyzed for Pattern Transfer

**Primary Sources:**
- **VSCode** - Universal developer tool, familiar keyboard patterns
- **JetBrains IDEs** - Smart context-aware features, refactoring patterns
- **Raycast** - Fuzzy search with frecency ranking, keyboard-first navigation

**Pattern Selection Rationale:** Target keyboard-first power users while maintaining VSCode accessibility (not niche Vim patterns despite user's Vim background)

### Patterns Adapted from Analogous Tools

#### Pattern 1: Smart Tab Stops with Library Search (VSCode + Innovation)
**Source:** VSCode snippet tab stops + custom enhancement

**Adaptation:**
```
Template: You are a ${1:persona} working on ${2:task}

At ${1:persona}:
- Inline search palette auto-opens
- Type to fuzzy search library
- Arrow keys navigate results
- Enter inserts, advances to next stop
- Esc closes search, enables manual entry
- Cmd+Enter inserts AND stays (multi-add for constraints)
```

**Key Innovation:** Tab stops trigger contextual library search automatically - no mode switching between structured and search workflows

**Behaviors:**
- Typing filters results in real-time (fuzzy matching)
- No match = manual entry mode (always possible)
- Context-aware categories (personas vs guardrails vs constraints per stop)
- Ghost text suggestions (VSCode Copilot style - dismissible, non-intrusive)

#### Pattern 2: Frecency-Ranked Search (Raycast)
**Source:** Raycast's intelligent result ranking

**Adaptation:**
```
Search algorithm: (frequency × 10) + (days_since_last_use × -1)

"Senior C# IDesign" - used 15 times yesterday = 149 score
"Staff React Design" - used 3 times, 10 days ago = 20 score

Top results = most frequent + most recent
```

**Enhancement:** Context-aware boosting
- If preview contains "C#" → boost C#-related snippets
- If using IDesign persona → boost IDesign constraints
- Smart relevance beyond string matching

#### Pattern 3: JetBrains Smart Context Actions
**Source:** IntelliJ intention actions (Alt+Enter)

**Adaptation:**
```
User selects text in preview: "Senior developer"
Cmd+. shows context menu:
- Make more specific (add technology)
- Add architecture expertise
- Save as snippet
- Find similar in library
- Extract to persona variable
```

**Additional JetBrains patterns:**
- Parameter info hints (show Co-Star section purpose as user types)
- Refactoring with preview (edit snippet, see all affected prompts)
- Smart defaults based on context detection

#### Pattern 4: Multi-Select Composition (Novel)
**Source:** Combination of patterns into new capability

**Adaptation:**
```
At constraint tab stop:
Type "no deps" → Cmd+Enter → Adds constraint, cursor stays
Type "windows" → Cmd+Enter → Adds constraint, cursor stays
Press Tab → Advances to next stop

Result: Multiple constraints added efficiently
```

### Complete Keyboard-First Workflow Design

**Primary Navigation (VSCode-style, not Vim):**
```
Tab                 → Next tab stop
Shift+Tab           → Previous tab stop
Esc                 → Close search, manual mode
Enter               → Insert, advance
Cmd+Enter           → Insert, stay (multi-add)
Cmd+K               → Global search
Ctrl+Space          → Re-open search at stop
↑/↓                 → Navigate results
Cmd+1/2/3/4         → Filter categories
```

**Editing & Composition:**
```
Cmd+Z               → Undo composition action
Cmd+Shift+Z         → Redo
Cmd+S               → Save as template
Cmd+Shift+S         → Save selection as snippet
Cmd+C               → Copy to clipboard
Cmd+.               → Context actions
```

**Optional Vim Mode (OFF by default):**
- Settings toggle for Vim navigation in preview pane only
- j/k/h/l, w/b, 0/$, dd, yy, p available
- Tab stops always work regardless of mode
- VSCode shortcuts remain primary

### Ghost Text Training Pattern (Q3: Option C)

**Implementation:** Inline suggestions that disappear if ignored

```
User types: "Sen" at persona stop
Ghost text appears (gray, italic):
"Senior C# Developer with IDesign expertise"

Tab → Accepts
Continue typing → Updates
Type different → Disappears
```

**Training scenarios:**
- Incomplete personas → Suggest completions
- Missing Co-Star sections → Suggest additions
- Common patterns → Show best practices
- All non-blocking, dismissible by continuing work

### 30-Second Expert Workflow Example

```
0:00  Cmd+K → Type "costar" → Enter (template inserted)
0:05  Type "sen c# ide" → Enter (persona from search)
0:10  Esc → Type goal manually → Tab
0:15  Type "prag" → Tab (ghost text accepted for style)
0:18  Arrow → Enter (tone selected)
0:20  Type "expert" → Tab (ghost text: "expert developer")
0:23  Type "code ex" → Enter (format from search)
0:25  Type "no deps" → Cmd+Enter → "windows" → Enter
0:30  Cmd+C → Done (copied to clipboard)

Total: 30 seconds, never touched mouse
```

### Novel Pattern Combinations Discovered

**Innovation 1: Search-Enabled Tab Stops**
- Tab stops + inline search = seamless structured/freeform hybrid
- Context awareness changes search category per stop
- Manual entry always possible (no lock-in)

**Innovation 2: Composition Undo Stack**
- Treat prompt building like code editing
- Full undo/redo for every insertion
- Cmd+Z removes last snippet, preserves rest

**Innovation 3: Snippet Workbench with Live Preview**
- Edit snippet → See all prompts using it
- JetBrains-style refactoring preview
- Atomic changes propagate with single undo

**Innovation 4: Multi-Add with Cmd+Enter**
- Add multiple constraints/guardrails efficiently
- Stay in same tab stop, keep adding
- Tab when done to advance

### Patterns Adapted vs. Rejected

**Adapted:**
- ✅ VSCode tab stops (universal familiarity)
- ✅ Raycast fuzzy search (developer muscle memory)
- ✅ JetBrains smart context (powerful without intrusion)
- ✅ Ghost text suggestions (familiar from Copilot)

**Considered but Scaled:**
- ⚠️ Vim keybindings (opt-in only, not default - too niche)
- ⚠️ Notion slash commands (interesting but less keyboard-efficient than tab stops)
- ⚠️ Figma variants (concept used but not UI pattern)
- ⚠️ Postman environments (deferred to Phase 2 project integration)

### Key Takeaways from Analogical Thinking

1. **Keyboard-first is non-negotiable** for developer tools
2. **VSCode patterns are lingua franca** (not Vim despite user expertise)
3. **Search + Structure = hybrid power** (search-enabled tab stops)
4. **Training must be passive** (ghost text, not popups)
5. **Context awareness differentiates** (smart suggestions based on what's already in prompt)

---

## Phase 3: Alien Anthropologist Results

**Technique Status:** ✅ Completed

### Critical Assumptions Exposed

**Assumption 1: "Frameworks Are Self-Explanatory"**
- Reality: Most users have never heard of Co-Star or Automat
- Impact: No explanation of what they are, when to use them, or how to learn more
- User confusion: "What's the difference between frameworks? Which should I pick?"

**Assumption 2: "Users Understand Prompt Engineering"**
- Reality: Many potential users are new to effective prompt writing
- Impact: Tool assumes expert knowledge of personas, guardrails, constraints
- User confusion: "What is a 'persona'? Why do I need one? How do I know if it's good?"

**Assumption 3: "Keyboard Shortcuts Are Universal"**
- Reality: Not all users are keyboard-first power users
- Impact: Cmd+K, Tab stops, modifier keys feel like "secret knowledge"
- User confusion: "What is 'Cmd'? Do I press keys together or in sequence?"

**Assumption 4: "Template Structure Adds Value"**
- Reality: Users may not understand WHY templates improve results
- Impact: Freeform seems simpler, templates seem like extra work
- User confusion: "Why not just write what I want? Why use sections?"

**Assumption 5: "Atomic Composition Is Obvious"**
- Reality: "Senior C# + IDesign" looks like jargon, not composition
- Impact: Users don't understand the power of reusable components
- User confusion: "Why save snippets? I'll just retype them each time"

### Three User Personas Identified

**Type 1: Complete Beginner**
- Never used LLMs effectively
- Doesn't know frameworks exist
- Needs: Heavy education, examples, tutorials, guided workflows

**Type 2: Casual User**  
- Uses ChatGPT occasionally with freeform prompts
- Knows better prompts exist but doesn't know how
- Needs: Light guidance, framework suggestions, quality hints

**Type 3: Power User**
- Knows frameworks inside-out
- Has opinions on Co-Star vs Automat
- Wants speed and customization
- Needs: Zero friction, keyboard shortcuts, custom frameworks

**Original Design Flaw:** Tool was designed ONLY for Type 3 (power users)

### Education-First Solutions Designed

**Solution 1: Framework Comparison & Selection**
```
Instead of dropdown, show educational picker:
- Framework descriptions (what each is for)
- Use case examples (when to use which)
- Preview examples (see before selecting)
- "Not sure?" quiz (guide selection)
- Comparison view (side-by-side differences)
```

**Solution 2: In-Context Help Per Section**
```
Each framework section has:
- Hover tooltip explaining purpose
- "Why this matters" explanation
- Examples of good inputs
- Link to detailed guide
- User-controlled show/hide
```

**Solution 3: Framework Learning Resources**
```
"Learn More" for each framework:
- What is this framework?
- When to use it?
- Section-by-section explanation
- Annotated example prompts
- External resources (articles, videos)
- Community best practices
```

**Solution 4: Example Gallery**
```
Browse pre-built prompts:
- Filter by framework type
- See real-world examples
- Use as template (one-click)
- Learn by reading good prompts
- Submit your own examples
```

**Solution 5: Smart Framework Suggestions**
```
Type in freeform: "Refactor authentication code..."
Tool detects: Code task
Suggests: "CODER framework works great for this!"
Explains: "Includes technical details and examples sections"
Non-blocking, dismissible
```

**Solution 6: Progressive Disclosure**
```
First launch: Heavy guidance, tutorials, examples
After 10 prompts: Light guidance, optional help
After 50 prompts: Minimal UI, advanced features visible
User can manually set level in settings
```

### Framework Strategy - Final Decisions

**Critical Insight from Alien Questions:**
User asked: "What's the difference between Automat and Co-Star? Which is better? Are there more? How do I learn?"

This revealed: **Education IS the product, not just composition**

**MVP Framework Set (All Unlocked):**

| Framework | Sections | Best For | Default |
|-----------|----------|----------|---------|
| **RTF** | 3 (Role, Task, Format) | General purpose, simplest | ⭐ YES |
| **CODER** | 5 (Context, Objective, Details, Examples, Response) | Code generation, technical | No |
| **Co-Star** | 6 (Context, Objective, Style, Tone, Audience, Response) | Content writing, creative | No |
| **Freeform** | 0 (no structure) | Experts, custom needs | Always available |

**Why RTF as Default:**
- Only 3 sections (minimal cognitive load)
- Self-explanatory names (Role, Task, Format)
- Universal applicability (code AND content)
- Maps to natural thinking
- Hard to mess up

**Why CODER for Developers:**
- Context = Role + technical background
- Objective = Clear "what to build"
- Details = Constraints, requirements, tech stack
- Examples = Code samples, patterns, I/O
- Response = Desired format (tests, docs, comments)

**Why Co-Star for Content:**
- Industry recognition (Sheila Teo)
- Style vs Tone vs Audience = sophistication
- Best-in-class for content creation
- Original user requirement

**Why NOT Feature Locking:**
- Users already advanced may know what they want
- Don't block power users from day 1
- Let users choose their own journey
- Progressive unlocking feels patronizing to experts

**Settings Control:**
- Enable/disable any framework
- Set default framework
- Show/hide comparison on launch
- Auto-suggest frameworks (opt-in)
- Remember last used framework
- Import custom frameworks

### Pre-filled Template Strategy

**Educational Templates (Can be dismissed):**

**CODER Templates:**
- Code Refactoring Template (auth module example)
- Bug Fix Template (debugging scenario)
- New Feature Template (greenfield dev)
- Test Generation Template (unit tests)

**Co-Star Templates:**
- Blog Post Template (technical writing)
- Marketing Copy Template (product launch)
- Documentation Template (technical docs)

**RTF Templates:**
- General Task Template (minimal)
- Explain Concept Template (educational)

**Template Behavior:**
- Shown in "New from template" gallery
- Pre-filled with example content
- One-click "Use this template" → placeholders
- One-click "View example" → completed version
- Dismissible from gallery
- Searchable via Cmd+K

**Educational Value:**
- Learn by example (see good prompts)
- Understand framework sections (filled examples)
- Quick start (modify template vs blank slate)
- Best practices embedded (templates show patterns)
- Non-intrusive (can be hidden/ignored)

### Key Insights from Alien Anthropologist

1. **Education must be embedded** - Tool teaches prompt engineering through usage
2. **Never assume knowledge** - Explain frameworks, sections, terminology
3. **Three user levels exist** - Beginner, Casual, Power User (design for all)
4. **Framework selection needs guidance** - Comparison, examples, suggestions
5. **"Why" matters as much as "how"** - Explain benefits, not just mechanics
6. **Progressive disclosure works** - Show complexity as user grows
7. **Templates are teaching tools** - Pre-filled examples educate through osmosis

### Product Vision Shift

**Before Alien Anthropologist:**
"A tool for creating structured prompts"

**After Alien Anthropologist:**
"A tool for LEARNING TO CREATE better prompts through structured frameworks and unobtrusive guidance"

The tool is both a productivity tool AND a teaching tool.

---

## Session Summary & Next Steps

### Total Ideas Generated: 50+

**Major Breakthrough Areas:**

1. **Hybrid Composition Model** - Structured library + freeform editing working seamlessly
2. **Search-Enabled Tab Stops** - Novel UX pattern combining VSCode tab stops with Raycast search
3. **Framework as Teaching Tool** - Education embedded in composition workflow
4. **Atomic Composition Grammar** - Small pieces combine into thousands of variations
5. **Passive Training Patterns** - Ghost text, quality indicators, context suggestions (all non-blocking)
6. **Three-Framework Strategy** - RTF (beginner), CODER (technical), Co-Star (creative)
7. **Template Gallery** - Pre-filled examples that teach best practices

### Core Product Definition

**What Prompt Alchemist Is:**
A desktop application (React + Tauri) that helps developers create high-quality LLM prompts through:
- Structured prompt frameworks (RTF, CODER, Co-Star)
- Reusable atomic snippet libraries (personas, guardrails, constraints)
- Keyboard-first power user workflow (search-enabled tab stops)
- Embedded education (learn by doing, not by reading docs)
- Framework experimentation (convert between templates)

**Target Users:**
- **Primary:** Developers who use LLMs for code generation
- **Secondary:** Technical writers, DevRel, product managers
- **Tertiary:** Anyone wanting to improve prompt quality

**Key Differentiators:**
1. Desktop-first (Tauri) with native file system integration
2. Search-enabled tab stops (unique UX innovation)
3. Framework switching/conversion (experimentation tool)
4. Atomic composition (combinatorial power from small pieces)
5. Education-first design (teaches as you use)

### Technical Architecture Summary

**Frontend:**
- React 19 + TypeScript
- Drag-and-drop composition interface
- Side-by-side preview (configurable layout)
- Search palette (Cmd+K, fuzzy matching with frecency)
- Tab stop navigation with inline search
- Ghost text suggestions (dismissible)

**Backend/Storage:**
- Tauri v2 (Rust)
- File system library storage
  - ~/.config/prompt-alchemist (Mac/Linux)
  - %LOCALAPPDATA%\prompt-alchemist (Windows)
- JSON format for atomic snippets
- Markdown format for export
- Framework conversion engine

**Data Model:**
```
Library:
  personas/
    {role}-{technology}-{architecture}.json
  guardrails/
    {name}.json
  constraints/
    {name}.json
  templates/
    {framework}-{task-type}.json

Settings:
  default_framework: "RTF"
  enabled_frameworks: ["RTF", "CODER", "Co-Star"]
  show_help: true
  vim_mode: false
  layout: "library-left"
```

**Frameworks:**
- RTF: 3 sections (Role, Task, Format)
- CODER: 5 sections (Context, Objective, Details, Examples, Response)
- Co-Star: 6 sections (Context, Objective, Style, Tone, Audience, Response)

### MVP Feature Checklist

**Core Composition:**
- ✅ Three frameworks (RTF, CODER, Co-Star) + Freeform
- ✅ Search-enabled tab stops
- ✅ Drag-and-drop snippet library
- ✅ Side-by-side editable preview
- ✅ Framework switching/conversion
- ✅ Keyboard-first navigation (VSCode shortcuts)
- ✅ Undo/redo composition stack

**Library Management:**
- ✅ Atomic snippet storage (personas, guardrails, constraints)
- ✅ Sub-component composition (role + tech + architecture)
- ✅ Search with fuzzy matching + frecency ranking
- ✅ Category filtering (Cmd+1/2/3/4)
- ✅ Create/edit/delete snippets
- ✅ Import/export library (JSON)

**Education & Help:**
- ✅ Framework comparison view
- ✅ Pre-filled template gallery
- ✅ In-context help per section (hover tooltips)
- ✅ Ghost text suggestions (non-blocking)
- ✅ Quality indicators (completeness, suggestions)
- ✅ Example prompt gallery
- ✅ User-controlled help toggle

**Desktop Integration:**
- ✅ Cross-platform config directory storage
- ✅ Clipboard paste into preview
- ✅ Clipboard copy with quality report
- ✅ File system read/write for libraries
- ✅ Native keyboard shortcuts

**Settings & Customization:**
- ✅ Enable/disable frameworks
- ✅ Set default framework
- ✅ Layout configuration (library left/right)
- ✅ Optional Vim mode
- ✅ Show/hide help
- ✅ Auto-suggest frameworks (opt-in)

### Phase 2 Features (Post-MVP)

**Framework Extensions:**
- Custom framework creator
- Framework marketplace/sharing
- Community framework templates
- More built-in frameworks (RISEN, RELIC, etc.)

**Advanced Composition:**
- Multi-prompt projects
- Prompt versioning/history
- A/B testing prompts
- Prompt quality analytics

**Collaboration:**
- Team library sharing
- Project-scoped libraries
- Export/import collections
- Commenting on snippets

**Intelligence:**
- AI-powered snippet suggestions
- Quality scoring with explanations
- Automatic snippet extraction from text
- Usage pattern analytics

### Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework Count** | 3 (RTF, CODER, Co-Star) | Covers all use cases without overwhelming |
| **Default Framework** | RTF | Simplest (3 sections), universal applicability |
| **Feature Locking** | None - all unlocked | Respect advanced users, no gatekeeping |
| **Keyboard Patterns** | VSCode (not Vim) | Universal familiarity for developers |
| **Training Approach** | Passive/unobtrusive | Ghost text, hints, never blocking |
| **Help System** | User-controlled toggle | Respect mastery, always available |
| **Library Scope** | Personal global (MVP) | Defer project complexity to Phase 2 |
| **Data Format** | JSON storage / MD export | Parse reliability + LLM compatibility |
| **Template Strategy** | Pre-filled examples | Educational, easily dismissed |
| **Desktop Integration** | Standard config dirs | Cross-platform, no project complexity |
| **Layout** | Side-by-side, configurable | Hybrid drag-drop + freeform editing |

### Success Metrics to Track

**Engagement:**
- Prompts created per user
- Framework usage distribution (RTF vs CODER vs Co-Star)
- Framework switching frequency
- Template usage rate

**Quality:**
- Prompt completeness scores
- Framework section fill rates
- Snippet reuse frequency
- User-reported prompt effectiveness

**Learning:**
- Help tooltip engagement
- Template gallery usage
- Example prompt views
- Framework comparison views

**Retention:**
- Daily active users
- Prompts per session
- Library size growth
- Return user rate

### Recommended Next Steps

**Immediate (This Week):**
1. Review and validate brainstorming session results
2. Share with stakeholders for feedback
3. Create lightweight PRD from session notes
4. Sketch UI mockups for core screens

**Short-term (Next 2 Weeks):**
1. Create detailed UX designs for:
   - Framework selector with comparison
   - Search-enabled tab stops interaction
   - Template gallery
   - Library management UI
2. Define data schema (JSON structures)
3. Create technical architecture document
4. Set up Tauri + React project structure

**Medium-term (Next Month):**
1. Implement core framework templates
2. Build search-enabled tab stops (critical UX innovation)
3. Create library management backend
4. Implement framework conversion engine
5. Design and populate template gallery

**Long-term (Next Quarter):**
1. Beta release to early adopters
2. Collect usage metrics and feedback
3. Iterate on UX based on data
4. Plan Phase 2 features
5. Build community/sharing features

### Files to Create from This Session

**Product Documentation:**
- `prd.md` - Product Requirements Document
- `user-personas.md` - Beginner, Casual, Power User profiles
- `competitive-analysis.md` - vs other prompt tools

**Design Documentation:**
- `ux-flows.md` - User journeys and workflows
- `ui-mockups/` - Wireframes and high-fidelity designs
- `design-system.md` - Component library, patterns

**Technical Documentation:**
- `architecture.md` - System design and data flow
- `data-schema.md` - JSON structures, file formats
- `api-contracts.md` - Tauri command interfaces
- `framework-definitions.md` - RTF, CODER, Co-Star specs

**Implementation Guides:**
- `dev-roadmap.md` - Sprint planning, milestones
- `mvp-scope.md` - Must-have vs nice-to-have features
- `technical-challenges.md` - Known complexity areas

### Session Reflection

**What Worked Well:**
- **Morphological Analysis** uncovered the hybrid composition model
- **Analogical Thinking** stole proven patterns (VSCode, Raycast, JetBrains)
- **Alien Anthropologist** exposed hidden assumptions about frameworks
- User's deep product thinking (Vim background but VSCode pragmatism)
- User's developer perspective caught missing education layer
- Collaborative exploration led to novel innovations (search-enabled tab stops)

**Key Breakthroughs:**
1. Search-enabled tab stops (unique UX innovation)
2. Three-framework strategy without locking (respects all user levels)
3. Education IS the product (not just composition)
4. Templates as teaching tools (learn by example)
5. Atomic composition grammar (combinatorial power)

**Surprise Insights:**
- Framework selection needed heavy education (not self-explanatory)
- Three user personas required different UX approaches
- Developers need CODER framework specifically
- Template gallery more valuable than expected
- Ghost text training more powerful than tutorials

**Creative Energy:**
- Strong collaboration throughout
- User asked clarifying questions that deepened exploration
- Alien perspective revealed critical blind spots
- Product vision evolved during session (composition → education)

### Final Thoughts

This brainstorming session transformed Prompt Alchemist from a "prompt composition tool" into a "prompt engineering learning platform." 

The breakthrough innovations:
- **Search-enabled tab stops** solve the structured vs freeform tension
- **Framework switching** enables experimentation and learning
- **Atomic composition** provides power without complexity
- **Embedded education** teaches through usage, not documentation
- **Three frameworks** cover all use cases without overwhelming

The MVP is well-scoped, technically feasible, and addresses real user needs. The product has clear differentiation (desktop-first, keyboard-first, education-first) and upgrade paths to Phase 2 features.

**This is ready to build.** 🚀

---

**Session completed:** 2025-12-27
**Facilitator:** Mary (BMad Method Analyst)
**Participant:** Timothygoshinski
**Duration:** ~90 minutes
**Techniques used:** Morphological Analysis, Analogical Thinking, Alien Anthropologist
**Total ideas generated:** 50+ concepts, patterns, and solutions
**Major innovations:** 7 breakthrough insights
**MVP definition:** Complete and actionable

**Next milestone:** Create PRD and begin UX design phase
