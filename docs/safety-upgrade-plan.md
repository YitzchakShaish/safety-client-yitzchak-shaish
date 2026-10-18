# Safety upgrade plan

Review date: 2026-10-18. Status: proposed; implementation awaits approval.

## Existing architecture and conventions

Keep React, TypeScript, MUI, React Router, Context and the existing API modules. Keep Express routes/controllers/services, TypeORM entities, class-validator DTOs and SQLite. Reuse the existing Hebrew labels, RTL theme, status alerts and report sections. Avoid a general redesign or framework migration.

Both repositories were clean at review start. The client baseline is b6c5a9f (fix/protect-image-upload); the server baseline is b5809aa (fix/known-bugs). Planning uses codex/safety-upgrade-plan in each repository, preserving these existing fixes.

## Verified findings

- There is no independent safety-officer role. Client permissions map military rank to basic/advanced/admin; the server advances rank every five report/update/delete actions.
- Update/delete routes authenticate callers but do not enforce ownership or role. Image uploads also lack report ownership checks. User listing is available to any authenticated user; user-by-ID is unauthenticated.
- Login accepts email and full name without a secret or identity verification. A role system needs authenticated identity to provide meaningful protection.
- Event details depend on router state; the server's single-report GET route is commented out. Direct links and refresh need a real detail endpoint.
- Submission has no pending lock. Reset leaves selected images intact and reuses initialization values captured at module load. The create API helper does not check res.ok and accesses result.data.id on errors. These are code findings, not a reproduced browser diagnosis.
- Profile upload only shows a success message. There is no persisted avatar field or upload endpoint.
- Existing statuses are not treated, in treatment and treated. Keep these initially; a closed status requires an explicit workflow decision.
- Overview already counts events, completed-today, open and severe events. The severe query includes treated events despite the client's open-critical label. No date/unit filtering or charts exist.
- Text search combines OR expressions without grouping before the reporter restriction; group the search predicates so filtering cannot bypass report visibility.
- SQLite configuration uses synchronize:true and TypeScript entity globs even for the compiled server. Plan explicit schema migration and validate compiled startup using an isolated database.
- No test scripts or seed scripts were found in package.json.
- Server build fails with two string|string[] route-parameter errors and an unused checkRank import.
- Client build passes with a bundle-size warning. Client lint reports 35 errors and 3 warnings, including conditional hooks in SingleEventPage. These are baseline failures before implementation.

## Proposed authorization policy

| Action | User | Safety officer | Administrator |
| --- | --- | --- | --- |
| Create report | Yes | Yes | Yes |
| Read reports | Own reports | Assigned unit | All |
| Edit report facts / attach images | Own, before treatment | Assigned unit | All |
| Change treatment status and recommendations | No | Assigned unit | All |
| View overview / export | No | Assigned unit | All |
| Delete report | No | No | Yes, confirmed |
| Manage rank, role and unit | No | No | Yes, audited |

Military rank, organizational position, unit and system role are independent. Enforce current permissions from the database for every protected action; client visibility is only presentation. Treat missing unit assignments as no unit access. Prevent removal of the last administrator. Never infer administrator privileges from existing rank. Bootstrap the first administrator explicitly.

Before implementing roles, confirm password-based local login versus a clearly designated demo-only identity selector. Recommended: password-based login with hashed passwords, explicit setup for existing accounts and no default production passwords.

## Implementation sequence and acceptance criteria

1. **Build baseline** — fix the three existing server compilation errors in a small separate commit; validate both builds. Record existing lint issues separately from new work.
2. **Report submission** — guard pending requests, normalize HTTP errors, show a saved-report confirmation with ID, viewing and new-report actions. Reset files, weather, current user and timestamps only when starting a new report. Preserve the saved ID if image upload fails; retry images without creating another report. Add an authorized detail GET endpoint and load by URL ID. Check double clicks, validation failure, network failure, upload failure and refresh/direct navigation.
3. **Identity and permissions** — implement the agreed login policy, independent roles/unit/position, server ownership and allowed-field checks, rank promotion removal and user administration. Audit actor, target, old/new values and timestamp in the same transaction as changes. Check cross-user and cross-unit access, forged fields, revoked roles and last-admin protection with API integration tests.
4. **Demo data** — add an explicit isolated demo database configuration and an idempotent seed for 50–100 fictitious events across several months, units, categories, severities and statuses. Use relative dates so the last-30-days view stays useful. Never reset the current database. Document demo accounts and optional weather/location service fallback.
5. **Safety overview** — default to the last 30 calendar days; use an inclusive date range with a defined timezone. Enforce unit scope server-side. Provide total, severe, open and treated counts, category distribution, weekly trends and a treatment queue with working detail links. Reconcile totals against fixture data and test empty ranges and date boundaries.
6. **Dedicated PDF** — reuse the same authorized, filtered dataset; include generation date, selected unit/range, metrics, charts and severe/open events. Choose the PDF dependency after checking Hebrew font embedding, RTL and pagination on a small prototype. Verify a multipage export visually.
7. **Profile photo and demo rehearsal** — persist the image through a self-service endpoint, validate size/type, show preview/default avatar and refresh current-user data after upload. Verify refresh persistence and unauthorized changes. Run the user → officer → administrator demo end to end.

## Git workflow

Commit this planning document separately. After approval use focused codex/ branches for build fixes, submission, permissions, demo seed, overview, PDF and profile as needed. Dependent branches start from the preceding approved work; independent work starts from the appropriate agreed base. Keep client/server commits coordinated and small. Check diffs and status before each commit; exclude secrets, databases, uploaded files and build outputs. Do not reset or rewrite existing user commits. Push/PR/merge are separate from this planning stage.

## Review boundary

This stage is source inspection and build/lint baseline checking only. No server startup, database mutation, browser reproduction, authentication change or product implementation is part of this planning commit. Approval is requested because the user explicitly asked to see plans before implementation.
