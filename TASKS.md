# Tasks

## Active Tasks

### fix-schedule-photo-crops
**Task**: Fix Thursday evening and Friday morning photo crops on mobile
**Stage**: VERIFY-APP
**Pipeline**: code-workflow
**Branch**: task/fix-schedule-photo-crops
**Worktree**: .worktree/fix-schedule-photo-crops
**Base**: main
**Started**: 2026-03-18
**Attempts**: 1
**Files**:
- MOD: schedule.html
**Quality Scores**:
| Stage | Score | Attempts | Status |
|-------|-------|----------|--------|
| IMPLEMENT | 9.95 | 1 | PASS |
| WRITE-TESTS | SKIP | - | SKIPPED |
| QUALITY-CHECK | SKIP | - | SKIPPED |
| SIMPLIFY | SKIP | - | SKIPPED |
| VERIFY-APP | - | 0 | CURRENT |

---

### rename-arrivals-to-flights
**Task**: Rename arrivals page to "Flights"
**Stage**: IMPLEMENT
**Pipeline**: code-workflow
**Branch**: task/rename-arrivals-to-flights
**Worktree**: .worktree/rename-arrivals-to-flights
**Base**: main
**Started**: 2026-03-18
**Attempts**: 1
**Files**:
- RENAME: arrivals.html -> flights.html
- MOD: home.html
- MOD: packing.html
- MOD: groceries.html
- MOD: schedule.html
- MOD: costs.html
- MOD: js/scroll-animations.js
**Quality Scores**:
| Stage | Score | Attempts | Status |
|-------|-------|----------|--------|
| IMPLEMENT | - | 0 | CURRENT |

---

### schedule-mobile-dividers
**Task**: Add section dividers between schedule slides on mobile
**Stage**: IMPLEMENT
**Pipeline**: code-workflow
**Branch**: task/schedule-mobile-dividers
**Worktree**: .worktree/schedule-mobile-dividers
**Base**: main
**Started**: 2026-03-18
**Attempts**: 1
**Files**:
- MOD: css/styles.css
**Quality Scores**:
| Stage | Score | Attempts | Status |
|-------|-------|----------|--------|
| IMPLEMENT | - | 0 | CURRENT |

---

### polish-costs-mobile
**Task**: Polish costs page layout for mobile
**Stage**: IMPLEMENT
**Pipeline**: code-workflow
**Branch**: task/polish-costs-mobile
**Worktree**: .worktree/polish-costs-mobile
**Base**: main
**Started**: 2026-03-18
**Attempts**: 1
**Files**:
- MOD: costs.html
**Quality Scores**:
| Stage | Score | Attempts | Status |
|-------|-------|----------|--------|
| IMPLEMENT | - | 0 | CURRENT |

---

## Backlog

### Flights Page
- [ ] align-flight-columns: Add header row and align flight columns as grid [P1] [depends: rename-arrivals-to-flights] [moderate] [tier: opus:medium] [design] [planned]
  files: flights.html (MOD), css/styles.css (MOD)
