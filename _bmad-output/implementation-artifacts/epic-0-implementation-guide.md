# Epic 0: CI/CD & Release Infrastructure - Implementation Guide

**Project:** prompt-alchemist  
**Created:** 2026-01-01  
**Epic Status:** Ready for Implementation  
**Prerequisites:** None (implements foundational infrastructure)  
**Duration Estimate:** 3-5 days

---

## Overview

Epic 0 establishes the complete CI/CD pipeline infrastructure **before** any product features are implemented. This ensures that every line of code written in Epic 1+ benefits from automated quality gates, multi-platform testing, and streamlined releases.

### Why Epic 0 First?

✅ **Quality from Day 1:** Catch linting, type errors, and test failures on every commit  
✅ **Cross-Platform Confidence:** Validate macOS, Windows, and Linux builds automatically  
✅ **Fast Feedback:** Developers know within 7 minutes if their code breaks anything  
✅ **Release Automation:** One command (`git tag v0.1.0 && git push --tags`) creates production builds  
✅ **No Technical Debt:** No retrofitting CI/CD later when you have 10,000+ lines of code  

---

## Epic Structure

### 6 Stories (Sequential Implementation Recommended)

| Story | Focus | Duration | Depends On |
|-------|-------|----------|------------|
| **0.1** | Integration Workflow (Quality Gates) | 1 day | None |
| **0.2** | Main/Release Workflow (Multi-Platform Builds) | 1 day | Story 0.1 |
| **0.3** | Release Automation (Version Tags) | 0.5 days | Story 0.2 |
| **0.4** | Branch Protection & Dependabot | 0.5 days | Story 0.3 |
| **0.5** | Pipeline Optimization (Caching) | 0.5 days | Story 0.4 |
| **0.6** | Documentation & Status Badges | 0.5 days | Story 0.5 |

**Total:** ~4 days (can extend to 5 days if testing each story thoroughly)

---

## Story Breakdown

### Story 0.1: Integration Workflow - Quality Gates
**Goal:** Automated checks on every commit to `integration` branch

**Deliverables:**
- `.github/workflows/ci-integration.yml` file
- 6 jobs running in parallel:
  1. `lint` - ESLint, Prettier, Stylelint, Clippy, Rust fmt
  2. `typecheck` - TypeScript compilation, lockfile validation
  3. `test-unit` - Vitest unit tests with coverage reports
  4. `test-e2e` - Playwright E2E tests with failure reports
  5. `test-rust` - Cargo unit tests
  6. `build-check` - macOS build verification (depends on jobs 1-5)

**Success Criteria:**
- Workflow triggers on push/PR to `integration`
- All jobs pass on a clean commit
- Total pipeline time: <7 minutes
- Failed commits clearly show which job failed

**Testing:**
1. Create feature branch: `feature/ci-setup`
2. Push `.github/workflows/ci-integration.yml`
3. Verify workflow appears in Actions tab
4. Intentionally break linting → verify job fails
5. Fix and verify job passes

---

### Story 0.2: Main/Release Workflow - Multi-Platform Builds
**Goal:** Production builds for all platforms (macOS, Windows, Linux)

**Deliverables:**
- `.github/workflows/ci-main.yml` file
- Build matrix with 3 platforms (parallel execution)
- Artifacts uploaded for each platform:
  - macOS: `.dmg`, `.app`
  - Windows: `.exe`, `.msi`
  - Linux: `.deb`, `.AppImage`

**Success Criteria:**
- Workflow triggers on push to `main`
- All 3 platforms build successfully
- Artifacts downloadable from Actions tab
- Total pipeline time: <20 minutes

**Testing:**
1. Merge CI setup to `integration`
2. Merge `integration` → `main`
3. Verify workflow triggers
4. Download artifacts from each platform
5. Test-install one artifact (e.g., macOS .dmg)

---

### Story 0.3: Release Automation with Version Tags
**Goal:** One-command releases with downloadable installers

**Deliverables:**
- `release` job in `ci-main.yml`
- Conditional execution on version tags (`v*`)
- Draft GitHub releases with auto-generated notes

**Success Criteria:**
- Tagging `v0.1.0-alpha.1` triggers release
- Draft release created with all artifacts
- Release notes include commits since last tag

**Testing:**
1. Create test tag: `git tag v0.1.0-alpha.1`
2. Push tags: `git push --tags`
3. Verify workflow runs with release job
4. Check Releases page for draft release
5. Download and verify artifacts

---

### Story 0.4: Branch Protection & Dependabot
**Goal:** Enforce quality gates and automate dependency updates

**Deliverables:**
- Branch protection rules on `integration` and `main`
- `.github/dependabot.yml` configuration
- Required status checks configured

**Success Criteria:**
- Direct pushes to `main` are blocked (admins only)
- PRs require all checks to pass before merge
- Dependabot creates weekly update PRs

**Testing:**
1. Configure branch protection in GitHub Settings
2. Attempt to merge PR with failing tests → blocked
3. Wait for Dependabot's first weekly run (or trigger manually)
4. Verify Dependabot PRs have correct labels and CI checks

---

### Story 0.5: Pipeline Optimization with Caching
**Goal:** Reduce pipeline times by 25-30% with smart caching

**Deliverables:**
- npm dependency caching (`actions/setup-node` with `cache: 'npm'`)
- Cargo dependency caching (`actions/cache@v4`)
- Cache keys based on `package-lock.json` and `Cargo.lock`

**Success Criteria:**
- Integration workflow: <7 minutes (target)
- Main workflow: <20 minutes (target)
- Cache hit rate: >80% over 10 runs
- Dependency installation: <30 seconds (cache hit) vs <2 minutes (cache miss)

**Testing:**
1. Add caching configuration to workflows
2. Run workflow twice on same commit → second run should be faster
3. Modify `package-lock.json` → verify cache invalidates
4. Monitor cache hit rates in Actions logs

---

### Story 0.6: Documentation & Status Badges
**Goal:** Team understands CI/CD system and can see build status

**Deliverables:**
- CI/CD status badges in `README.md`
- `docs/cicd.md` documentation covering:
  - Workflow overview (integration vs main)
  - How to create releases
  - Troubleshooting guide
  - Expected pipeline times

**Success Criteria:**
- README shows live build status for both workflows
- Documentation covers all common scenarios
- New team members can understand system from docs alone

**Testing:**
1. Add badges to README
2. Verify badges update when workflow runs
3. Review docs with a fresh perspective (or teammate review)
4. Test troubleshooting steps work as documented

---

## Implementation Workflow

### Recommended Sequence

#### Day 1: Integration Workflow
1. **Morning:** Create `.github/workflows/ci-integration.yml`
   - Start with `lint` and `typecheck` jobs only
   - Test on feature branch
2. **Afternoon:** Add `test-unit`, `test-e2e`, `test-rust` jobs
   - Verify all tests pass
   - Add `build-check` job
3. **End of Day:** Merge to `integration` branch
   - **Checkpoint:** Integration workflow fully operational

#### Day 2: Main/Release Workflow
1. **Morning:** Create `.github/workflows/ci-main.yml`
   - Copy integration jobs
   - Add build matrix for 3 platforms
2. **Afternoon:** Test multi-platform builds
   - Fix any platform-specific issues
   - Download and verify artifacts
3. **End of Day:** Merge to `main`
   - **Checkpoint:** Main workflow building all platforms

#### Day 3: Release Automation + Branch Protection
1. **Morning:** Add release job to `ci-main.yml`
   - Test with alpha tag (`v0.1.0-alpha.1`)
   - Verify draft release creation
2. **Afternoon:** Configure branch protection + Dependabot
   - Set up required checks
   - Create `.github/dependabot.yml`
3. **End of Day:** System enforces quality gates
   - **Checkpoint:** Full CI/CD pipeline operational

#### Day 4: Optimization + Documentation
1. **Morning:** Add caching to workflows
   - Test cache hit/miss scenarios
   - Measure performance improvements
2. **Afternoon:** Write documentation
   - Add status badges to README
   - Create `docs/cicd.md`
3. **End of Day:** Epic 0 complete! 🎉
   - **Checkpoint:** Ready to start Epic 1 with full CI/CD support

---

## Rollout Strategy (from BMAD Master's Plan)

### Week 1: Soft Launch
- ✅ Create workflows on feature branch
- ✅ Test thoroughly before merging
- ✅ Merge to `integration` first
- ❌ Do NOT enforce branch protection yet (testing phase)

### Week 2: Integration Enforcement
- ✅ Verify integration workflow stability (run 10+ times successfully)
- ✅ Enable branch protection on `integration`
- ✅ Require all checks to pass
- ❌ Main branch not yet enforced

### Week 3: Main Branch Enforcement
- ✅ Verify main workflow stability
- ✅ Enable branch protection on `main`
- ✅ Require all checks to pass + 1 review
- ✅ Full CI/CD system active

### Week 4: Release Automation
- ✅ Test release workflow with alpha tags
- ✅ Document release process
- ✅ Enable automatic releases
- ✅ **Epic 0 Complete → Start Epic 1**

---

## Success Metrics

### Pipeline Performance Targets
- **Integration Workflow:** <7 minutes total
  - Lint: ~1-2 minutes
  - Typecheck: ~1 minute
  - Unit tests: ~2-3 minutes
  - E2E tests: ~3-5 minutes
  - Rust tests: ~2-3 minutes
  - Build check: ~5-7 minutes (runs after others)

- **Main Workflow:** <20 minutes total
  - Quality gates: ~5-7 minutes (parallel)
  - macOS build: ~10-15 minutes
  - Windows build: ~10-15 minutes
  - Linux build: ~10-15 minutes
  - (Builds run in parallel)

### Quality Targets
- **Pipeline Success Rate:** >95% (excluding intentional failures)
- **Cache Hit Rate:** >80% over 10 runs
- **Flaky Test Rate:** <2%
- **Time to Feedback:** Developer knows commit status within 7 minutes

---

## Troubleshooting Common Issues

### Issue: Playwright tests fail in CI but pass locally
**Solution:**
```yaml
# Add to test-e2e job
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true  # Ensures CI-specific Playwright config
```

### Issue: Tauri build fails - missing system dependencies (Linux)
**Solution:** Verify all dependencies are installed:
```yaml
- name: Install dependencies (Ubuntu)
  if: matrix.platform == 'ubuntu-latest'
  run: |
    sudo apt-get update
    sudo apt-get install -y libwebkit2gtk-4.1-dev \
      build-essential \
      libssl-dev \
      libayatana-appindicator3-dev \
      librsvg2-dev
```

### Issue: npm ci failed - lockfile out of date
**Solution:**
```bash
# Locally regenerate lockfile
npm install
git add package-lock.json
git commit -m "chore: update lockfile"
git push
```

### Issue: Workflow takes >30 minutes (too slow)
**Solution:**
1. Verify caching is enabled
2. Check if Cargo/npm cache is invalidating unnecessarily
3. Consider limiting integration builds to macOS only (main still builds all platforms)

---

## Cost Considerations

### GitHub Actions Minutes (if private repo)
- **Free Tier:** 2,000 minutes/month (Linux), 1,000 minutes/month (macOS with 10x multiplier)
- **Per Integration Push:** ~80 minutes (10 Linux + 70 macOS)
- **Per Main Push:** ~139 minutes (15 Linux + 100 macOS + 24 Windows)
- **Monthly Estimate:** 10 integration + 5 main = ~1,495 minutes/month

**This project is public, so unlimited minutes! 🎉**

---

## Next Steps After Epic 0

Once Epic 0 is complete and all workflows are stable:

1. **Start Epic 1** (Foundation & Application Shell)
   - Every commit to Epic 1 will benefit from CI/CD
   - No need to think about CI anymore - it just works!

2. **Monitor Pipeline Health**
   - First week: Check Actions tab daily
   - Address any flaky tests immediately
   - Optimize slow jobs if needed

3. **Team Training**
   - Share `docs/cicd.md` with team
   - Demonstrate release process
   - Show how to interpret workflow results

---

## Reference Documents

- **Original CI/CD Plan:** `_bmad-output/github-actions-cicd-implementation-plan.md` (BMAD Master's detailed plan)
- **Epic Definitions:** `_bmad-output/project-planning-artifacts/epics.md` (Epic 0 stories)
- **Sprint Status:** `_bmad-output/implementation-artifacts/sprint-status.yaml` (tracking)

---

## Final Checklist

Before marking Epic 0 as "Done":

- [ ] Integration workflow runs successfully on `integration` branch
- [ ] Main workflow builds all 3 platforms successfully
- [ ] Release automation creates draft releases on version tags
- [ ] Branch protection rules enforce quality gates
- [ ] Dependabot creates weekly update PRs
- [ ] Caching reduces pipeline times by 25-30%
- [ ] Documentation covers all workflows and troubleshooting
- [ ] Status badges show in README
- [ ] Team trained on CI/CD system

**When all checked → Epic 0 DONE! Ready to begin Epic 1 with full CI/CD support! 🚀**

---

**Questions or Issues?**  
Reference the original BMAD Master plan or ask your friendly Business Analyst (Mary) for clarification! 📊
