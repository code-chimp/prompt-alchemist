# Story 0.3: Release Automation with Version Tags

**Epic:** 0 - CI/CD & Release Infrastructure  
**Story ID:** 0-3-release-automation-with-version-tags  
**Status:** ready-for-dev  
**Estimated Effort:** Medium (5-8 hours)  
**Created:** 2026-01-01  
**Dependencies:** Story 0.2 (main workflow provides multi-platform build artifacts)

---

## User Story

**As a** developer  
**I want** releases to be created automatically when I push a version tag (e.g., `v0.1.0`)  
**So that** production deployments are streamlined with downloadable artifacts for all platforms

---

## Acceptance Criteria

### AC1: Release Job Definition
**Given** the `ci-main.yml` workflow includes a `release` job  
**When** the `release` job is defined  
**Then** the job depends on the `build` job (all platforms)  
**And** the job runs on `ubuntu-latest`  
**And** the job is conditional: `if: startsWith(github.ref, 'refs/tags/v')`  
**And** the job has `contents: write` permission for creating releases

**Implementation Notes:**
- **File to modify**: `.github/workflows/ci-main.yml` (from Story 0.2)
- **Job dependencies**: `needs: [build]` (waits for all matrix platforms)
- **Conditional execution**: `if: startsWith(github.ref, 'refs/tags/v')`
- **Permissions**: Add `permissions: contents: write` at job level or workflow level
- **Runner**: `ubuntu-latest` (cheapest, no platform-specific code)
- **Purpose**: Release job only runs when a version tag (v*) is pushed
- **Non-blocking**: If release job fails, build artifacts are still available

---

### AC2: Version Tag Trigger
**Given** a version tag is pushed (e.g., `git tag v0.1.0 && git push --tags`)  
**When** the workflow is triggered  
**Then** the `main` workflow runs with all quality gates and multi-platform builds  
**And** the `release` job executes only if the tag starts with `v`

**Implementation Notes:**
- **Tag format**: `v*` (e.g., `v0.1.0`, `v1.2.3-beta`, `v2.0.0-rc1`)
- **Trigger configuration**: Already configured in Story 0.2 (`on: push: branches: [main]`)
- **CRITICAL**: GitHub Actions triggers on BOTH branch pushes AND tag pushes to the same branch
- **Tag push workflow**:
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  # OR push all tags:
  git push --tags
  ```
- **Conditional logic**: `if: startsWith(github.ref, 'refs/tags/v')` ensures release only runs for version tags
- **Non-version tags**: Tags without `v` prefix (e.g., `test-tag`) skip the release job
- **GitHub ref format**: Version tags appear as `refs/tags/v0.1.0` in `github.ref`

---

### AC3: Artifact Download Configuration
**Given** the `release` job executes  
**When** downloading artifacts  
**Then** `actions/download-artifact@v4` is used to download all build artifacts:
- `macos-builds` (from macOS job)
- `windows-builds` (from Windows job)
- `linux-builds` (from Linux job)  
**And** artifacts are downloaded to `./artifacts` directory  
**And** artifact structure is verified with `ls -R ./artifacts`

**Implementation Notes:**
- **Action**: `actions/download-artifact@v4` (latest stable)
- **Download strategy**: Download each artifact separately or use default (all artifacts)
- **Recommended approach**: Download all artifacts at once (simpler)
  ```yaml
  - name: Download all artifacts
    uses: actions/download-artifact@v4
    with:
      path: ./artifacts
  ```
- **Artifact structure** (after download):
  ```
  ./artifacts/
    macos-builds/
      *.dmg
      *.app/ (directory)
    windows-builds/
      *.msi
      *.exe
    linux-builds/
      *.deb
      *.AppImage
  ```
- **Verification step**: Add `ls -R ./artifacts` to confirm structure
- **Troubleshooting**: If artifacts missing, check build job completed successfully
- **Artifact retention**: 7 days (from Story 0.2), must create release within 7 days

---

### AC4: GitHub Release Creation
**Given** all artifacts are downloaded  
**When** creating the GitHub release  
**Then** `softprops/action-gh-release@v1` is used to create the release  
**And** the release is marked as `draft: true` (requires manual publish)  
**And** release notes are generated automatically via `generate_release_notes: true`  
**And** all artifacts are uploaded to the release:
- `./artifacts/macos-builds/**/*` (DMG and .app bundles)
- `./artifacts/windows-builds/**/*` (MSI and EXE installers)
- `./artifacts/linux-builds/**/*` (DEB and AppImage packages)

**Implementation Notes:**
- **Action**: `softprops/action-gh-release@v1` (recommended for Tauri/Rust projects)
- **Draft mode**: `draft: true` (requires manual publish for safety)
- **Release notes**: `generate_release_notes: true` (auto-generates from commits)
- **Configuration**:
  ```yaml
  - name: Create GitHub Release
    uses: softprops/action-gh-release@v1
    with:
      draft: true
      generate_release_notes: true
      files: |
        ./artifacts/macos-builds/**/*
        ./artifacts/windows-builds/**/*
        ./artifacts/linux-builds/**/*
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```
- **File glob patterns**: `**/*` matches all files recursively in artifact directories
- **GITHUB_TOKEN**: Automatically provided by GitHub Actions (no manual secret needed)
- **Draft release benefits**:
  - Review artifacts before publishing
  - Edit release notes manually
  - Add additional documentation/changelog
  - Control release timing independently of tag push
- **Release notes generation**: Includes all commits since last tag (semantic release style)

---

### AC5: Release Verification
**Given** the release is created  
**When** navigating to the Releases page on GitHub  
**Then** a draft release with the tag name (e.g., `v0.1.0`) is visible  
**And** all platform artifacts are attached to the release  
**And** auto-generated release notes include commits since the last tag  
**And** the release can be edited and published manually by the maintainer

**Implementation Notes:**
- **Releases page**: `https://github.com/{owner}/{repo}/releases`
- **Draft indicator**: Release shows "Draft" badge (yellow) until published
- **Artifact verification**: Check all 6 artifacts present (2 macOS + 2 Windows + 2 Linux)
- **Expected artifacts**:
  - `prompt-alchemist_<version>_x64.dmg` (macOS DMG)
  - `prompt-alchemist.app.tar.gz` (macOS app bundle, compressed)
  - `prompt-alchemist_<version>_amd64.deb` (Linux Debian package)
  - `prompt-alchemist_<version>_amd64.AppImage` (Linux portable)
  - `prompt-alchemist_<version>_x64_en-US.msi` (Windows installer)
  - `prompt-alchemist_<version>_x64-setup.exe` (Windows NSIS installer)
- **Release notes content**:
  - Commit list since last tag
  - PR references (if merged via PR)
  - Contributor mentions (if applicable)
- **Manual publish workflow**:
  1. Navigate to draft release
  2. Review artifacts (download and test if needed)
  3. Edit release notes (add highlights, breaking changes, etc.)
  4. Click "Publish release" button
  5. Release becomes public, users notified (if watching repo)

---

### AC6: Release Failure Handling
**Given** the release creation fails (e.g., artifact upload error)  
**When** the job fails  
**Then** detailed error logs are available in the Actions tab  
**And** the workflow status is "failed"  
**And** no partial release is created (release is atomic)

**Implementation Notes:**
- **Common failure scenarios**:
  - Missing artifacts (build job failed)
  - GitHub API rate limiting (rare)
  - Invalid GITHUB_TOKEN permissions (check workflow permissions)
  - Artifact size exceeds GitHub limits (2GB per file, rare for desktop apps)
  - Network timeouts during upload
- **Error handling**: `softprops/action-gh-release` fails atomically (no partial releases)
- **Debugging steps**:
  1. Check build job logs (ensure all platforms succeeded)
  2. Verify artifact download step succeeded
  3. Check release job logs for upload errors
  4. Verify GITHUB_TOKEN has `contents: write` permission
- **Recovery workflow** (if release fails):
  1. Fix underlying issue (e.g., permissions, artifact paths)
  2. Delete failed tag: `git tag -d v0.1.0 && git push --delete origin v0.1.0`
  3. Re-create and push tag: `git tag v0.1.0 && git push origin v0.1.0`
  4. Workflow re-runs automatically
- **Alternative recovery**: Manually create release via GitHub UI using downloaded artifacts

---

### AC7: Non-Version Tag Behavior
**Given** a non-version tag is pushed (e.g., `test-tag` without `v` prefix)  
**When** the workflow runs  
**Then** the `release` job is skipped  
**And** only the build jobs execute (no release created)

**Implementation Notes:**
- **Conditional logic**: `if: startsWith(github.ref, 'refs/tags/v')` ensures release skipped
- **Non-version tag examples**: `test-tag`, `experiment`, `archive-2024`
- **Use cases for non-version tags**:
  - Internal testing/archiving
  - Experimental builds
  - Pre-release markers (use `v*-beta` instead for releases)
- **GitHub Actions UI**: Release job shows as "Skipped" (not failed)
- **Workflow status**: "Success" (skipped jobs don't affect overall status)
- **Build artifacts**: Still generated and uploaded (available for 7 days)
- **Testing strategy**: Use non-version tags to test multi-platform builds without creating releases

---

## Development Notes

### Workflow Modification Structure

**Modify**: `.github/workflows/ci-main.yml` (from Story 0.2)

**Add release job**:
```yaml
# After the build job from Story 0.2
release:
  needs: [build]
  runs-on: ubuntu-latest
  if: startsWith(github.ref, 'refs/tags/v')
  permissions:
    contents: write
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Download all artifacts
      uses: actions/download-artifact@v4
      with:
        path: ./artifacts
    
    - name: Display artifact structure
      run: ls -R ./artifacts
    
    - name: Create GitHub Release
      uses: softprops/action-gh-release@v1
      with:
        draft: true
        generate_release_notes: true
        files: |
          ./artifacts/macos-builds/**/*
          ./artifacts/windows-builds/**/*
          ./artifacts/linux-builds/**/*
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Key Technical Requirements

**Permissions:**
- **Workflow level** (recommended): Add at top of workflow file
  ```yaml
  permissions:
    contents: write
  ```
- **Job level**: Add to release job only
  ```yaml
  release:
    permissions:
      contents: write
  ```
- **Why needed**: Creating releases requires write access to repository contents

**Tag Format Validation:**
- **Valid**: `v0.1.0`, `v1.2.3`, `v2.0.0-beta`, `v1.0.0-rc1`
- **Invalid** (for release): `0.1.0`, `version-1.0`, `test-tag`, `v` (no version)
- **Regex equivalent**: `^refs/tags/v.*` (any tag starting with `v`)
- **Semantic versioning recommended**: `vMAJOR.MINOR.PATCH` (e.g., `v1.2.3`)

**Artifact Download:**
- **Action version**: `actions/download-artifact@v4` (latest stable)
- **Default behavior**: Downloads all artifacts from current workflow run
- **Path parameter**: Specifies download location (default: current directory)
- **Merge behavior**: Each artifact downloaded to subdirectory (artifact name)

**Release Creation:**
- **Action**: `softprops/action-gh-release@v1` (community standard for Rust/Tauri)
- **Alternative**: `actions/create-release@v1` + `actions/upload-release-asset@v1` (deprecated)
- **Draft mode**: Prevents accidental public releases (best practice)
- **Generate release notes**: Uses GitHub's auto-generated notes (commits, PRs, contributors)
- **File upload**: Supports glob patterns (recursive `**/*`)

### Testing Strategy

**Test Scenario 1: Version Tag Release**
1. Ensure Stories 0.1 and 0.2 are complete (workflows exist and work)
2. Create version tag: `git tag v0.0.1-test`
3. Push tag: `git push origin v0.0.1-test`
4. Verify:
   - All quality gates pass
   - All 3 platforms build successfully
   - Release job executes
   - Draft release created with 6 artifacts
   - Release notes generated

**Test Scenario 2: Non-Version Tag (No Release)**
1. Create non-version tag: `git tag test-no-release`
2. Push tag: `git push origin test-no-release`
3. Verify:
   - Quality gates and builds execute
   - Release job skipped (not failed)
   - No draft release created
   - Workflow status: success

**Test Scenario 3: Release Failure Recovery**
1. Introduce intentional error (e.g., wrong artifact path)
2. Push version tag
3. Verify workflow fails
4. Fix error in workflow file
5. Delete tag: `git tag -d v0.0.1 && git push --delete origin v0.0.1`
6. Re-create tag: `git tag v0.0.1 && git push origin v0.0.1`
7. Verify release succeeds

**Test Scenario 4: Manual Publish Workflow**
1. Create draft release (via version tag push)
2. Navigate to Releases page on GitHub
3. Click draft release
4. Edit release notes (add highlights)
5. Click "Publish release"
6. Verify release is public and users can download artifacts

### Dependencies from Previous Stories

**Story 0.1 (Integration Workflow):**
- Quality gate job patterns established
- npm and Cargo caching strategies defined
- Test execution and artifact upload patterns

**Story 0.2 (Main/Build Workflow):**
- **CRITICAL DEPENDENCY**: Multi-platform build matrix implemented
- Artifact upload with consistent naming: `macos-builds`, `windows-builds`, `linux-builds`
- Build job produces all artifacts needed for release
- Workflow file `.github/workflows/ci-main.yml` exists

**This Story (0.3) Requirements:**
- Must modify existing `ci-main.yml` workflow (not create new file)
- Release job depends on successful build job completion
- Artifact names must match Story 0.2 output

### Common Pitfalls and Solutions

**Pitfall 1: Missing Permissions**
- **Symptom**: Release job fails with "Resource not accessible by integration"
- **Solution**: Add `permissions: contents: write` to workflow

**Pitfall 2: Incorrect Artifact Paths**
- **Symptom**: Release created but no artifacts attached
- **Solution**: Verify artifact download structure with `ls -R`, adjust file paths

**Pitfall 3: Release Not Draft**
- **Symptom**: Release immediately public without review
- **Solution**: Ensure `draft: true` in release action configuration

**Pitfall 4: Duplicate Releases**
- **Symptom**: Multiple draft releases for same tag
- **Solution**: `softprops/action-gh-release` overwrites existing draft (safe)

**Pitfall 5: Tag Push Without Builds**
- **Symptom**: Release created but artifacts missing
- **Solution**: Ensure build job completed successfully before release job runs

### Semantic Versioning Best Practices

**Version Format**: `vMAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]`

**Examples:**
- `v1.0.0` - First stable release
- `v1.1.0` - New feature (minor version bump)
- `v1.1.1` - Bug fix (patch version bump)
- `v2.0.0` - Breaking change (major version bump)
- `v1.0.0-beta.1` - Pre-release (beta version)
- `v1.0.0-rc.2` - Release candidate

**Tagging Workflow:**
```bash
# Create annotated tag with message
git tag -a v0.1.0 -m "Release v0.1.0: Initial public release"

# Push tag to origin
git push origin v0.1.0

# Or push all tags
git push --tags
```

**Deleting Tags (if needed):**
```bash
# Delete local tag
git tag -d v0.1.0

# Delete remote tag
git push --delete origin v0.1.0
```

---

## Technical References

### Source Documents
1. **Epic Definition**: `_bmad-output/project-planning-artifacts/epics.md` (lines 537-593)
2. **CI/CD Strategy**: `_bmad-output/github-actions-cicd-implementation-plan.md` (lines 325-336)
3. **Previous Story 0.2**: `_bmad-output/implementation-artifacts/0-2-github-actions-main-release-workflow-multi-platform-builds.md`

### Related Stories
- **Story 0.1**: Integration workflow (quality gates foundation)
- **Story 0.2**: Main/build workflow (provides multi-platform artifacts) - **CRITICAL DEPENDENCY**
- **Story 0.4**: Branch protection rules (protects release process)
- **Story 0.5**: Pipeline optimization (future caching improvements)

### Dependencies
- **Story 0.2**: MUST be completed first (provides `ci-main.yml` and build artifacts)
- **Workflow file**: `.github/workflows/ci-main.yml` must exist
- **Build artifacts**: Must be uploaded with consistent names (macos-builds, windows-builds, linux-builds)
- **GitHub repository**: Must have Actions enabled
- **GitHub token**: Automatically provided (`secrets.GITHUB_TOKEN`)

### Architecture Compliance
- ✅ **CI/CD Strategy**: Implements automated release creation on version tags
- ✅ **Draft releases**: Requires manual publish for safety
- ✅ **Auto-generated notes**: Includes commits since last tag
- ✅ **Multi-platform artifacts**: All platforms included in release
- ✅ **Semantic versioning**: Enforces `v*` tag format

### External Resources
- **GitHub Releases Documentation**: https://docs.github.com/en/repositories/releasing-projects-on-github
- **softprops/action-gh-release**: https://github.com/softprops/action-gh-release
- **actions/download-artifact**: https://github.com/actions/download-artifact
- **Semantic Versioning**: https://semver.org/
- **Tauri Release Guide**: https://tauri.app/v1/guides/distribution/

---

## Definition of Done

- [ ] `.github/workflows/ci-main.yml` modified (release job added)
- [ ] Release job depends on build job (all platforms)
- [ ] Release job runs on `ubuntu-latest`
- [ ] Release job conditional on version tags (`if: startsWith(github.ref, 'refs/tags/v')`)
- [ ] Workflow permissions include `contents: write`
- [ ] Artifact download configured (all 3 platforms)
- [ ] Artifact structure verified with `ls -R ./artifacts`
- [ ] GitHub release creation configured with `softprops/action-gh-release@v1`
- [ ] Release marked as draft (`draft: true`)
- [ ] Release notes auto-generated (`generate_release_notes: true`)
- [ ] All artifacts uploaded to release (6 files total)
- [ ] Test: Version tag push creates draft release with all artifacts
- [ ] Test: Non-version tag skips release job
- [ ] Test: Draft release can be edited and published manually
- [ ] Test: Release failure is atomic (no partial releases)
- [ ] Documentation updated (if needed)

---

## Next Steps for Developer

1. **Prerequisite**: Verify Story 0.2 is complete (`.github/workflows/ci-main.yml` exists with build matrix)
2. **Modify workflow**: Open `.github/workflows/ci-main.yml`
3. **Add permissions**: Add `permissions: contents: write` at workflow level (top of file)
4. **Add release job**: Copy job configuration from Development Notes section
5. **Verify dependencies**: Ensure release job depends on build job (`needs: [build]`)
6. **Configure artifact download**: Use `actions/download-artifact@v4` with `path: ./artifacts`
7. **Configure release creation**: Use `softprops/action-gh-release@v1` with draft mode
8. **Commit workflow changes**: Push to `main` branch (or create PR if branch protection enabled)
9. **Test version tag**: `git tag v0.0.1-test && git push origin v0.0.1-test`
10. **Verify draft release**: Check GitHub Releases page for draft with all artifacts
11. **Test non-version tag**: `git tag test-no-release && git push origin test-no-release`
12. **Verify release skipped**: Check Actions UI shows release job skipped
13. **Clean up test tags**: Delete test tags if needed
14. **Move story to done**: Update `sprint-status.yaml` when complete

---

## Implementation Tips

**Before You Start:**
1. Review Story 0.2 implementation (understand artifact naming)
2. Check GitHub repository permissions (ensure Actions enabled)
3. Understand semantic versioning (v prefix requirement)

**During Implementation:**
1. Start with minimal release job (just artifact download)
2. Test artifact download structure before adding release creation
3. Use `ls -R ./artifacts` to debug artifact paths
4. Test with a `-test` suffix version tag first (e.g., `v0.0.1-test`)
5. Verify draft release before testing publish workflow

**Testing Strategy:**
1. Push version tag (e.g., `v0.0.1-test`)
2. Wait for workflow to complete (~20-25 minutes)
3. Check Releases page for draft release
4. Verify all 6 artifacts present and downloadable
5. Review auto-generated release notes
6. Edit and publish draft release manually
7. Delete test tag and release after verification

**Troubleshooting:**
1. If release job fails with permissions error: Add `contents: write` permission
2. If artifacts missing: Check build job completed successfully, verify artifact names
3. If wrong files uploaded: Check glob patterns in `files:` configuration
4. If release not draft: Verify `draft: true` in action configuration
5. If release notes empty: Ensure at least one previous tag exists for comparison

---

**Story File Generated:** 2026-01-01  
**Ready for Development:** Yes  
**Blocked:** No (Story 0.2 provides artifact foundation)  
**Blockers:** None
