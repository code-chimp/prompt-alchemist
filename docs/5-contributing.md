# Contributing Guidelines

Thank you for your interest in contributing to this project! This guide will help you get started with contributing code, documentation, or other improvements.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/tauri2-react-starter.git
cd tauri2-react-starter

# Add upstream remote
git remote add upstream https://github.com/code-chimp/tauri2-react-starter.git
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Set Up Development Environment

Follow the [Getting Started Guide](./0-getting-started.md) to set up your development environment.

```bash
npm install
npm run tauri:dev
```

## Development Workflow

### Making Changes

1. **Make your changes** following the [Development Guide](./3-development-guide.md)
2. **Test your changes** thoroughly (see [Testing Guide](./4-testing-guide.md))
3. **Ensure code quality** passes all checks

### Code Quality Checks

Before committing, ensure all checks pass:

```bash
# Run all linters
npm run lint

# Auto-fix issues
npm run fix

# Run unit tests
npm run test:unit

# Run E2E tests (if applicable)
npm run test:e2e
```

### Commit Guidelines

We suggest [Conventional Commits](https://www.conventionalcommits.org/) for clear and consistent commit messages.

#### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring (no feature or bug fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, tooling, etc.)
- `ci`: CI/CD changes

#### Examples

```bash
# Simple commit
git commit -m "feat: add user authentication"

# With scope
git commit -m "fix(auth): resolve login redirect issue"

# With body
git commit -m "feat(ui): add dark mode toggle

Added a theme toggle button in the header.
Uses next-themes for theme management.
Persists user preference to localStorage."

# Breaking change
git commit -m "feat!: migrate to Tauri v2

BREAKING CHANGE: Updated to Tauri v2 API.
Old invoke methods are no longer compatible."
```

### Pre-commit Hooks

The project uses Husky + lint-staged to automatically run checks before commits:

- **ESLint** on `.ts` and `.tsx` files
- **Prettier** for formatting
- **Stylelint** on `.css` files

If checks fail, the commit will be blocked. Fix issues and try again.

## Pull Request Process

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template

### 3. PR Title

Follow the same format as commit messages:

```
feat: add user authentication
fix: resolve memory leak in event listener
docs: update installation instructions
```

### 4. PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement

## Changes Made
- Added X feature
- Fixed Y bug
- Refactored Z component

## Testing
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Linting passes (`npm run lint`)
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### 5. Code Review

- Address reviewer feedback promptly
- Make requested changes in new commits
- Don't force push after review starts (unless asked)
- Be open to suggestions and constructive criticism

### 6. Merging

Once approved:
- Maintainers will merge your PR
- Your branch will be deleted automatically

## Development Guidelines

### Code Style

Follow the patterns in the [Development Guide](./3-development-guide.md):

- Use TypeScript strict mode
- Prefer functional components
- Use typed Tauri command wrappers
- Follow ESLint and Prettier rules

### Testing Requirements

- Add unit tests for new features
- Update tests when modifying existing features
- E2E tests for critical user flows
- Maintain or improve code coverage

### Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Adding new dependencies
- Modifying configuration

## What to Contribute

### Good First Issues

Look for issues labeled:
- `good first issue` - Beginner-friendly tasks
- `help wanted` - Community contributions welcome
- `documentation` - Documentation improvements

### Areas for Contribution

#### Features
- New Tauri commands
- UI components
- User-facing features
- Developer tools

#### Bug Fixes
- Fix reported issues
- Resolve edge cases
- Improve error handling

#### Documentation
- Improve existing docs
- Add code examples
- Create tutorials
- Fix typos

#### Tests
- Increase test coverage
- Add missing test cases
- Improve test quality

#### Performance
- Optimize rendering
- Reduce bundle size
- Improve startup time

#### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support

## Reporting Issues

### Bug Reports

Use the bug report template with:

1. **Description** - Clear summary of the bug
2. **Steps to Reproduce** - Detailed steps
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, Node version, Rust version
6. **Screenshots** - If applicable
7. **Logs** - Error messages or console output

### Feature Requests

Use the feature request template with:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - Your suggested approach
3. **Alternatives** - Other solutions considered
4. **Additional Context** - Screenshots, examples, etc.

## Project Structure

Understanding the project structure helps with contributions:

```
tauri2-react-starter/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── lib/                # Utilities and Tauri wrappers
│   └── main.tsx            # Entry point
├── src-tauri/              # Rust backend
│   ├── src/                # Rust source
│   └── tauri.conf.json     # Tauri config
├── tests/                  # E2E tests
├── docs/                   # Documentation
└── scripts/                # Build scripts
```

## Review Process

### Timeline

- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Approval and merge: After all checks pass and approval

### Review Criteria

- Code quality and maintainability
- Test coverage
- Documentation completeness
- Performance impact
- Breaking changes (if any)
- Consistency with project patterns

## Getting Help

### Questions?

- **Documentation**: Check [docs/](.) folder first
- **GitHub Discussions**: Ask questions or discuss ideas
- **Issues**: Report bugs or request features
- **Email**: tim@code-chimp.com

### Resources

- [Getting Started](./0-getting-started.md)
- [Architecture](./1-architecture.md)
- [Development Guide](./3-development-guide.md)
- [Testing Guide](./4-testing-guide.md)
- [Tech Stack](./2-tech-stack.md)

## License

By contributing, you agree that your contributions will be licensed under the BSD 3-Clause License (same as the project).

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- Documentation credits (for substantial doc improvements)

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉
