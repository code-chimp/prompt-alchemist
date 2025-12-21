# Personalizing Your Project

After cloning the tauri2-react-starter template, you'll want to customize it for your specific project. This guide explains the automated personalization process and how to make manual adjustments if needed.

## Table of Contents

- [Quick Start](#quick-start)
- [What Gets Changed](#what-gets-changed)
- [Interactive Personalization](#interactive-personalization)
- [Command-Line Options](#command-line-options)
- [Manual Personalization](#manual-personalization)
- [Troubleshooting](#troubleshooting)

## Quick Start

After cloning the repository and installing dependencies:

```bash
npm install
npm run init
```

The initialization script will:
1. Ask you a series of questions about your project
2. Show you a preview of all changes
3. Update all relevant files
4. Optionally reset your git history
5. Remove itself after successful completion

## What Gets Changed

The init script updates the following files and values:

### package.json
- `name` - Project name (kebab-case)
- `version` - Reset to `0.1.0`
- `description` - Your project description
- `author` - Your name, email, and website
- `repository` - Your repository URL
- `bugs` - Issue tracker URL and contact email
- `homepage` - Project homepage URL
- `license` - Your chosen license

### src-tauri/Cargo.toml
- `name` - Project name (kebab-case)
- `version` - Reset to `0.1.0`
- `description` - Your project description
- `authors` - Your name and email
- `lib.name` - Library name (snake_case with `_lib` suffix)

### src-tauri/tauri.conf.json
- `productName` - Display name for your application
- `version` - Reset to `0.1.0`
- `identifier` - Bundle identifier (reverse-DNS format)
- `app.windows[0].title` - Window title

### Other Files
- **index.html** - Page title
- **README.md** - Project name, description, author, and repository references
- **.idea/[project].iml** - IntelliJ IDEA project file (renamed)
- **.idea/modules.xml** - Module reference updated

## Interactive Personalization

When you run `npm run init`, you'll be prompted for the following information:

### Project name (kebab-case)
- **Format**: lowercase with hyphens (e.g., `my-awesome-app`)
- **Validation**: Must be a valid npm package name
- **Used in**: package.json, Cargo.toml, file names

### Product/Display name
- **Format**: Human-readable title (e.g., `My Awesome App`)
- **Default**: Auto-generated from project name
- **Used in**: Window title, README title, tauri.conf.json

### Description
- **Format**: Free-form text
- **Used in**: package.json, Cargo.toml, README

### Author name (optional)
- **Format**: Your full name
- **Used in**: package.json author, Cargo.toml authors, README

### Author email (optional)
- **Format**: Valid email address
- **Validation**: Must match email format if provided
- **Used in**: package.json author, Cargo.toml authors, bug contact

### Author website (optional)
- **Format**: Full URL (must start with `http://` or `https://`)
- **Validation**: Must be a valid URL if provided
- **Used in**: package.json author.url, README

### Repository URL (optional)
- **Format**: Full URL to your git repository
- **Auto-detected**: If you have a git remote configured
- **Used in**: package.json repository, bugs URL, homepage, README

### Bundle identifier
- **Format**: Reverse-DNS notation (e.g., `com.mycompany.app-name`)
- **Default**: Auto-generated from email domain or `com.mycompany.[project-name]`
- **Validation**: Must match reverse-DNS format
- **Used in**: tauri.conf.json identifier (required for macOS/iOS)

### License
- **Options**: BSD-3-Clause (default), MIT, Apache-2.0, GPL-3.0, ISC
- **Note**: The LICENSE file is NOT automatically updated
- **Action required**: Update the LICENSE file manually if you change from BSD-3-Clause

### Reset git history (y/N)
- **Default**: No (safe choice)
- **Only shown**: If `.git` directory exists
- **Action**: Removes `.git`, runs `git init`, and creates initial commit
- **Warning**: This permanently removes all git history

## Command-Line Options

### Dry Run

Preview changes without modifying any files:

```bash
npm run init -- --dry-run
```

This will:
- Run through all prompts
- Show the change preview
- Exit without writing any files

### Force Re-initialization

If you've already run the init script and want to run it again:

```bash
npm run init -- --force
```

This bypasses the `.initialized` check and allows you to re-personalize the project.

## Manual Personalization

If you prefer not to use the automated script, or need to make changes later, you can manually update these files:

### Essential Updates

1. **package.json** - Lines 2-4, 16-30
   ```json
   {
     "name": "your-project-name",
     "version": "0.1.0",
     "description": "Your description",
     "author": {
       "name": "Your Name",
       "email": "your@email.com",
       "url": "https://yoursite.com"
     }
   }
   ```

2. **src-tauri/Cargo.toml** - Lines 2-5, 14
   ```toml
   [package]
   name = "your-project-name"
   version = "0.1.0"
   description = "Your description"
   authors = ["Your Name <your@email.com>"]

   [lib]
   name = "your_project_name_lib"
   ```

3. **src-tauri/tauri.conf.json** - Lines 3-5, 15
   ```json
   {
     "productName": "Your Product Name",
     "version": "0.1.0",
     "identifier": "com.yourdomain.yourapp",
     "app": {
       "windows": [{
         "title": "Your Product Name"
       }]
     }
   }
   ```

### Optional Updates

4. **index.html** - Line 7
   ```html
   <title>Your Product Name</title>
   ```

5. **README.md** - Update project name, description, and author references

6. **.idea/tauri2-react-starter.iml** - Rename to `.idea/your-project-name.iml`

7. **LICENSE** - Update if using a different license

### Creating the Marker File

If you personalize manually, create a `.initialized` file to suppress the postinstall reminder:

```bash
echo '{"initializedAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","manual":true}' > .initialized
```

## Troubleshooting

### "This project has already been initialized"

**Cause**: The `.initialized` marker file exists.

**Solutions**:
- Use `--force` to re-initialize: `npm run init -- --force`
- Delete `.initialized` and run again
- Make manual changes if you only need small updates

### Package name validation errors

**Error**: "name can only contain URL-friendly characters"

**Solution**: Use only lowercase letters, numbers, and hyphens. No spaces, underscores (in package name), or special characters.

**Good**: `my-awesome-app`, `desktop-app-2024`
**Bad**: `My_Awesome_App`, `desktop app`, `app@2024`

### Bundle identifier validation errors

**Error**: "Invalid bundle ID (format: com.domain.app-name)"

**Solution**: Use reverse-DNS notation with lowercase letters, numbers, hyphens, and dots.

**Good**: `com.mycompany.my-app`, `io.github.username.appname`
**Bad**: `myapp`, `com.MyCompany.App`, `com.company`

### Rust compilation fails after rename

**Cause**: The library name in Cargo.toml doesn't match the expected snake_case format.

**Solution**: Check `src-tauri/Cargo.toml` line 14. It should be:
```toml
name = "your_project_name_lib"  # underscores, not hyphens
```

### IntelliJ IDEA doesn't recognize project

**Cause**: The `.idea/modules.xml` file still references the old project name.

**Solution**: Either:
- Re-run the init script with `--force`
- Manually update `.idea/modules.xml` to reference your new `.iml` file name
- Close the project and reopen it in IntelliJ

### Git history wasn't reset

**Cause**: You chose "N" when prompted to reset git history.

**Solution**: Manually reset if desired:
```bash
rm -rf .git
git init
git add .
git commit -m "chore: initialize project from template"
```

**Warning**: This permanently removes all git history.

### Script deleted itself but initialization failed

**Cause**: The script self-destructs after completion, even if there were issues.

**Solution**: The init script is still in version control. Restore it:
```bash
git checkout scripts/init-project.ts
```

Then investigate the error and run again.

### Postinstall still shows initialization reminder

**Cause**: The `.initialized` marker file wasn't created.

**Solution**: Either:
- Run the init script successfully
- Create the marker file manually (see [Manual Personalization](#creating-the-marker-file))

## Post-Initialization Steps

After personalizing your project:

1. **Review the README** - Customize the content to describe your app
2. **Update the LICENSE** - If you chose a different license, replace the LICENSE file
3. **Customize .gitignore** - Add any project-specific ignore patterns
4. **Update dependencies** - Run `npm install` to ensure everything is up to date
5. **Test the build** - Run `npm run tauri:dev` to verify everything works
6. **Make your first commit** - If you didn't reset git history:
   ```bash
   git add .
   git commit -m "chore: personalize project from template"
   ```

## Related Documentation

- [Getting Started Guide](0-getting-started.md) - Initial setup and installation
- [Development Guide](3-development-guide.md) - Code patterns and conventions
- [Contributing Guidelines](5-contributing.md) - How to contribute back to the template

---

Need help? Open an issue on the [tauri2-react-starter repository](https://github.com/code-chimp/tauri2-react-starter/issues).
