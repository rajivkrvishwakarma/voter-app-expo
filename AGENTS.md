# Production-Grade Expo Mobile App — AI Engineering Rules

> **Purpose:** These rules are mandatory for any AI agent that creates, edits, reviews, or refactors this Expo application. Treat this file as the project's engineering contract—not optional suggestions.
>
> **Primary stack:** Expo + React Native + TypeScript + NativeWind + TanStack Query + Zustand + a centralized Theme Provider.
>
> **Priority order:** Correctness and security → maintainability → accessibility → performance → visual polish. Never sacrifice correctness or security for speed or appearance.

---

## 1. Mandatory Working Method

Before writing code, the AI agent **MUST**:

1. Inspect the existing repository, `package.json`, Expo SDK version, TypeScript configuration, routing setup, NativeWind configuration, lint/test setup, environment variables, and current folder structure.
2. Identify existing conventions and reusable code. Extend the current architecture instead of creating a competing one.
3. Check installed package versions and official compatibility requirements before proposing dependency changes. Do not blindly install the newest version.
4. Understand the requested feature end-to-end: user flow, screen states, API contracts, validation, permissions, loading/error behavior, and navigation.
5. Search for existing components, hooks, services, types, tokens, and utilities before creating new ones.
6. Present a short implementation plan for substantial changes, including the files to create/update and any assumptions or missing API contracts.
7. If critical requirements are unclear, ask a focused question. Otherwise, make the smallest reasonable assumption and document it.

After writing code, the AI agent **MUST**:

1. Run the available type checks, linting, tests, and relevant Expo checks. Fix issues introduced by its changes.
2. Inspect the final diff for duplicate logic, unsafe casts, secrets, debug logs, dead code, and accidental unrelated changes.
3. Report what changed, important design decisions, checks actually run, and any checks that could not be run.
4. Never claim that a build, test, API call, or device behavior works unless it was actually verified. Be explicit about limitations.

**Never:** rewrite large parts of the project without need, silently change API contracts, invent endpoints or response fields, hide errors, suppress TypeScript errors to make a build pass, or leave placeholder implementations presented as finished work.

---

## 2. Core Technology Rules

- **Expo / React Native:** Use Expo-compatible APIs and libraries. Prefer Expo modules where appropriate and verify compatibility with the project's Expo SDK.
- **TypeScript:** Use strict typing. Avoid `any`; prefer `unknown` plus runtime validation when data is not trusted.
- **Styling:** Use **NativeWind** for component styling. Do not introduce a second styling system for ordinary UI.
- **Server state and API lifecycle:** Use **TanStack React Query** for fetching, caching, mutations, retries, invalidation, pagination, and request lifecycle.
- **Client/UI state:** Use **Zustand** for shared client-side state that genuinely needs to be shared across screens or components.
- **Theme:** Read colors, typography, spacing, radii, elevations, and other design tokens from the centralized Theme Provider / design-token system.
- **Navigation:** Follow the routing system already in the repository. If starting from scratch, prefer Expo Router unless a documented project requirement says otherwise.
- **Forms:** Use the project's established form library. If none exists, choose a React Native-compatible form/validation approach and use it consistently.
- **Testing:** Use the test tools already configured. Add focused tests for business logic, services, hooks, and important UI states.

Do not add a library for a problem already solved by the existing stack. Explain and justify any new dependency.

---

## 3. Architecture and Folder Structure

Keep code organized by **feature/domain**, with each screen in its own folder. Adapt the exact structure to the current router and project; do not create duplicate route files merely to satisfy a template.

A suggested structure:

```text
src/
  app/                         # Expo Router routes/layouts, if used
    (auth)/
    (tabs)/
    _layout.tsx
  screens/                     # Screen implementation folders, if not colocated with routes
    home/
      HomeScreen.tsx
      components/
      hooks/
      types.ts
      index.ts
    profile/
      ProfileScreen.tsx
      components/
      hooks/
      types.ts
      index.ts
  components/
    ui/                        # Reusable, generic UI primitives
    feedback/                  # Loader, error state, empty state, offline state
    forms/
  features/                    # Feature-specific domain logic when appropriate
  services/
    api/
      client.ts                # Shared HTTP client and common configuration
      endpoints.ts             # CENTRAL API endpoint registry
      types.ts                 # Shared transport types, if genuinely shared
    auth/
      auth.service.ts
      auth.types.ts
    users/
      users.service.ts
      users.types.ts
  hooks/                       # Truly cross-feature hooks only
  store/
    auth.store.ts
    app.store.ts
  providers/
    AppProviders.tsx
    QueryProvider.tsx
    ThemeProvider.tsx
  theme/
    tokens.ts
    light.ts
    dark.ts
    index.ts
  utils/                       # Small, pure, reusable utilities
  constants/
  types/                       # Truly global types only
  assets/
```

### Structure rules

- Each screen must have a clear home folder. Keep screen-specific components, hooks, and types close to that screen or feature.
- Components reused by multiple features belong in a centralized shared component area. Do not centralize a component used only once just for the sake of it.
- Feature-specific components stay within their feature. Avoid giant global `components/`, `utils/`, or `types/` dumping grounds.
- Put business logic in services or domain functions, not inside JSX.
- Keep navigation files thin: route configuration, layout, and screen composition only.
- Avoid circular imports. Keep dependencies flowing in one direction: UI → hooks/use cases → services → API client.
- Use explicit, consistent barrel exports only where they improve imports. Avoid barrels that create circular dependencies.
- Do not create one file per trivial expression. Modularize around meaningful responsibilities.

---

## 4. API Registry and Service Layer — Required

### 4.1 Define API endpoints in one central place first

Before implementing API calls for a feature, inspect the supplied API documentation, existing backend code, Postman collection, or known contracts. Then add the endpoint to a central registry such as `src/services/api/endpoints.ts`.

Example:

```ts
// src/services/api/endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    signIn: '/auth/sign-in',
    refresh: '/auth/refresh',
    signOut: '/auth/sign-out',
  },
  users: {
    me: '/users/me',
    byId: (id: string) => `/users/${encodeURIComponent(id)}`,
  },
} as const;
```

The endpoint names and paths above are examples only. **Never assume they exist in the real backend.** Use verified API contracts and actual project naming.

Rules:

- Keep endpoint paths in the central registry; do not scatter raw endpoint strings through screens, components, or hooks.
- Use named, domain-based groups. Dynamic path segments must be encoded safely.
- Document HTTP method, parameters, request body, response shape, authentication requirements, and known error responses when useful.
- If an API contract is unknown, mark it as an explicit unresolved assumption or ask for the contract. Do not invent a production endpoint.
- Keep base URL and environment-specific configuration separate from endpoint paths.
- Do not hardcode hostnames, access tokens, API keys, or environment-specific URLs in feature code.

### 4.2 Create a service for every API operation

Every backend operation must be implemented in a **domain service** (for example, `auth.service.ts`, `users.service.ts`, `orders.service.ts`). Screens must never call `fetch`, Axios, or the HTTP client directly.

Each service should:

- Use the shared API client.
- Accept explicit, typed parameters.
- Return typed data—not UI components or navigation actions.
- Handle transport-level concerns consistently and preserve useful error details.
- Avoid duplicating endpoint strings and common request configuration.
- Keep business rules out of the low-level HTTP client.
- Be straightforward to test independently.

Prefer one service module per domain, with clearly named functions. Split a service when it becomes difficult to navigate; do not create a separate file for every trivial function unless the codebase benefits from it.

### 4.3 Shared API client

Use one configured HTTP client for common concerns:

- Base URL from environment configuration.
- Default headers and content type where appropriate.
- Authentication token attachment through the approved auth mechanism.
- Consistent response parsing and error normalization.
- Request cancellation via `AbortSignal` where supported.
- Request IDs or safe diagnostic metadata when useful.
- Correct handling of `401`, `403`, `404`, validation failures, rate limits, server errors, and offline/network errors.
- A single, carefully designed token-refresh flow if the backend supports refresh tokens.

Do not automatically retry every request. Retry safe transient failures only. Do not retry mutations blindly unless the operation is known to be idempotent or uses a server-supported idempotency key.

Never log passwords, access/refresh tokens, personal data, payment information, or full sensitive request/response bodies.

### 4.4 Validate untrusted API data

TypeScript types do not validate runtime JSON. For high-risk, complex, or externally controlled payloads, use runtime schema validation (for example, the project's existing validation library) at the API boundary. At minimum, handle absent, null, malformed, and unexpected fields defensively.

Do not use `as SomeType` to pretend an unverified API response is valid.

---

## 5. TanStack React Query — Server State Only

Use TanStack Query for remote/server data. Do not mirror the same API response in Zustand without a clear, documented reason.

### Required conventions

- Create query hooks close to their feature, such as `useUserProfileQuery.ts` or `useOrdersQuery.ts`.
- Create mutation hooks for writes, such as `useUpdateProfileMutation.ts`.
- Hooks call domain services; services call the shared API client.
- Define stable, centralized query keys. Use a query-key factory for non-trivial features.
- Include every relevant input in a query key: IDs, filters, pagination, search terms, and sorting.
- Use `enabled` when a query requires an ID, authentication, or another prerequisite.
- Set sensible `staleTime`, `gcTime`, retry, and refetch behavior based on the data's needs. Do not blindly use aggressive polling or refetch-on-focus everywhere.
- Use `invalidateQueries` or safe cache updates after successful mutations.
- Use optimistic updates only when rollback and conflict handling are correct.
- Use `useInfiniteQuery` for genuinely paginated/infinite lists.
- Pass cancellation signals through to the network client when supported.
- Keep query functions deterministic and free from UI side effects.
- Never initiate API requests inside render logic or `useEffect` when a query hook is the correct abstraction.
- Do not fetch the same data separately in multiple components if a shared query can reuse the cache.

### Query key example

```ts
export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

This is an example convention; adapt it to the existing project.

### UI state for every query

Design all relevant states intentionally:

- Initial loading.
- Background refresh.
- Success.
- Empty result.
- Recoverable error with retry.
- Offline/network failure.
- Pagination loading and end-of-list.
- Mutation pending, success, and failure.
- Stale data while refreshing, where appropriate.

Do not replace a populated screen with a full-page spinner on every background refetch. Avoid flashing empty states while data is refreshing.

---

## 6. Zustand — Client State Only

Use Zustand for shared **client-side state**, such as:

- UI preferences and local interaction state.
- Draft workflows that must persist across screens.
- Carefully designed authentication/session state, if required by the architecture.
- Temporary selections or multi-step form state.

Do not use Zustand as a second server cache for data already owned by TanStack Query.

Rules:

- Create small, domain-specific stores instead of one giant global store.
- Use selectors to subscribe to only the state a component needs.
- Keep actions with the state they update and type them explicitly.
- Avoid storing derived values that can be computed.
- Avoid copying props or query results into a store without a clear reason.
- Reset user-specific state on logout and account changes.
- Persist only necessary state. Do not persist secrets or sensitive personal data in plain storage.
- If persistence is needed, choose storage appropriate to the data. Use secure storage for credentials/tokens where required by the auth design; do not treat ordinary AsyncStorage as a secure vault.
- Keep persisted state versioned and handle migrations or invalid old data safely.

---

## 7. Theme Provider and Visual Consistency

**All app colors and design tokens must come from the centralized theme system.** Never scatter arbitrary hex colors throughout screens.

Define and consistently use tokens for:

- Background and surface levels.
- Primary, secondary, accent, and semantic colors.
- Text primary/secondary/disabled and inverse text.
- Borders, dividers, focus rings, and overlays.
- Success, warning, error, and informational states.
- Typography scale, font weights, and line heights.
- Spacing scale.
- Border radii and elevation/shadows.
- Icon sizes and touch target sizes.
- Light/dark theme variants if supported.

Rules:

- Components must use the active theme, not assume a fixed light or dark background.
- Keep NativeWind classes and theme tokens aligned. Configure NativeWind so theme changes reliably affect the UI; do not invent unsupported class behavior.
- If dynamic theme values cannot be represented cleanly through classes, use a documented, centralized token-to-style strategy rather than hardcoding values in each component.
- Avoid mixing arbitrary margins, radii, and font sizes when design tokens exist.
- Establish shared typography and spacing conventions and apply them across every screen.
- Use the same button, input, card, header, modal, list-row, and feedback patterns throughout the app.
- Use a single icon library where possible. Avoid mixing emoji, unrelated icon packs, and inconsistent icon sizes in production UI.
- Design a deliberate visual hierarchy: one clear primary action per screen where possible, readable typography, consistent spacing, and restrained use of color.
- Avoid excessive gradients, shadows, borders, animations, and decorative elements that reduce clarity or performance.

### Visual quality gate

Before calling a screen complete, compare it with neighboring screens and check:

- Header height, safe-area behavior, alignment, and spacing.
- Typography, button height, input treatment, corner radius, and icon style.
- Loading, error, empty, disabled, and success states.
- Light/dark mode behavior where supported.
- Small-screen layouts and long content.
- Keyboard, modal, and bottom-tab interactions.

The app should feel like one coherent product, not a collection of unrelated screens.

---

## 8. NativeWind Rules

- Use NativeWind classes for standard layout, spacing, typography, borders, colors, and responsive styling where supported by the installed version.
- Confirm the NativeWind and Tailwind versions and configuration before changing syntax or setup.
- Do not assume web CSS works in React Native. Use only supported React Native styles and NativeWind utilities.
- Use `StyleSheet.create` or a small centralized style helper only when a style is dynamic, unsupported by NativeWind, or measurably clearer that way.
- Do not scatter inline style objects throughout JSX for styles that should be shared or tokenized.
- Avoid giant conditional class strings. Extract repeated patterns into components or small class helpers.
- Keep conditional classes readable and deterministic.
- Never use DOM elements, browser CSS, or browser-only APIs in React Native screens.
- Verify that any class-merging utility is installed and configured before using it.

---

## 9. Component Size, Modularity, and Responsibilities

**Target:** Keep components under approximately **250 lines**. Treat **300 lines as a strong warning** and **350 lines as the maximum preferred limit**. If a component exceeds that range, split it unless there is a clear, documented reason not to.

Line count is a warning signal, not the only measure of quality. A 150-line component can still be badly designed.

Split large components into meaningful units such as:

- Screen composition.
- Header or toolbar.
- Reusable form sections.
- List item/card.
- Modal/sheet.
- Empty/error/loading states.
- Feature-specific hooks.
- Pure formatting or transformation functions.

Rules:

- Each component should have one clear responsibility.
- Keep JSX focused on presentation and composition.
- Move complex logic into a custom hook or domain function when it improves readability and testing.
- Extract repeated UI into shared components when used in multiple places or when it establishes a consistent design pattern.
- Do not create excessive abstraction for one-line components that add no meaningful clarity.
- Avoid prop drilling through many levels; use composition or a suitable store/context when justified.
- Keep component props explicit and typed. Avoid broad bags of optional props that create unpredictable behavior.
- Use stable keys for list items; never use array indices as keys for reorderable or mutable lists unless there is a defensible reason.
- Use `React.memo`, `useMemo`, and `useCallback` only where they address a real rendering or identity problem. Do not add them mechanically.

---

## 10. Screen and Navigation Quality

Every screen must be production-ready, not just the happy path.

- Follow the existing navigation conventions and keep route definitions clear.
- Use typed route parameters where supported.
- Validate and handle missing or malformed route parameters.
- Define behavior for back navigation, deep links, expired sessions, and unauthorized screens.
- Avoid duplicate navigation actions caused by repeated taps or race conditions.
- Prevent navigation to protected screens when authentication requirements are not met.
- Preserve relevant state when users navigate back, where expected.
- Use appropriate safe-area handling and platform-aware keyboard behavior.
- Avoid hardcoded screen dimensions. Support small devices, large devices, different font scales, and orientation where relevant.
- Use `FlatList` or an appropriate virtualized list for long collections rather than rendering hundreds of rows in a `ScrollView`.
- Set list keys, empty states, pagination, pull-to-refresh, and loading footers correctly.
- Use confirmation for destructive or irreversible actions.
- Ensure modals and bottom sheets support dismissal, accessibility, keyboard interactions, and Android back behavior.

---

## 11. Forms and Input Handling

- Use typed form values and a consistent validation strategy.
- Validate at the UI boundary for fast feedback and on the server for authority; client validation is never a security boundary.
- Display field-level errors close to the relevant field and provide a clear summary when needed.
- Normalize input only when the domain rules allow it. Do not silently alter meaningful user input.
- Use correct keyboard types, capitalization, autocomplete, and secure-entry settings.
- Support keyboard avoidance, scroll-to-field, focus order, and submit actions.
- Disable or guard duplicate submissions while a mutation is pending.
- Preserve user-entered data when a recoverable request fails.
- Avoid logging sensitive form values.
- Ensure errors are actionable and understandable, not raw stack traces or backend dumps.

---

## 12. Security and Privacy

Security is mandatory, even for an MVP.

- Never put private API keys, service-role keys, signing secrets, or database credentials in the mobile bundle or `EXPO_PUBLIC_*` variables. Public environment variables are shipped to the client.
- Treat the mobile app as an untrusted client. Enforce authorization and validation on the backend.
- Store credentials and refresh tokens using an appropriate secure-storage solution and a reviewed lifecycle. Never store them in source code, logs, or ordinary persisted UI state.
- Handle logout, token expiry, revocation, account switching, and session restoration deliberately.
- Do not assume hiding a button protects an endpoint.
- Use HTTPS in production. Do not disable TLS verification to “fix” a network issue.
- Avoid exposing internal server errors, stack traces, tokens, or sensitive identifiers in user-facing messages.
- Sanitize or validate deep-link parameters and external input.
- Use least-privilege permissions and request device permissions only when a feature needs them. Explain why the permission is needed.
- Protect sensitive screens and data according to the product's threat model.
- Do not add analytics or crash reporting that captures sensitive values.
- Ensure logs are useful but privacy-safe; remove noisy debug logs before release.
- Never use client-side encryption as a substitute for server-side authorization or transport security.

---

## 13. Error Handling and Resilience

- Use a consistent, typed application error model for network, validation, authentication, authorization, not-found, rate-limit, and server failures.
- Keep technical details in safe diagnostics and show users concise, actionable messages.
- Distinguish offline errors from server errors and invalid input.
- Provide retry actions only when retry makes sense.
- Handle empty, null, partial, and unexpected data safely.
- Prevent unhandled promise rejections and silent failures.
- Do not swallow errors with empty `catch` blocks.
- Do not show success notifications before the operation has actually succeeded.
- Avoid stacking duplicate toasts or alerts for one failure.
- Provide graceful behavior when optional services are unavailable.
- Use an error boundary for unexpected rendering failures where appropriate, but do not treat it as a replacement for normal request handling.

---

## 14. Performance and Battery

- Keep the JavaScript/UI work lightweight and avoid unnecessary re-renders.
- Use virtualized lists for large data sets and stable keys for list rows.
- Paginate large responses; do not download all records without a product reason.
- Optimize images with appropriate dimensions, caching, and formats. Avoid repeatedly decoding oversized images.
- Avoid expensive synchronous work during render and on the JS thread.
- Debounce search input when appropriate and cancel obsolete requests.
- Avoid unbounded polling, needless background work, and aggressive refetching.
- Clean up subscriptions, event listeners, timers, and native resources when no longer needed.
- Use animations that are compatible with the chosen React Native animation approach and avoid unnecessary layout thrashing.
- Measure before introducing complex optimization. Prioritize demonstrated bottlenecks over speculative micro-optimization.
- Test performance on a realistic physical device, not only a simulator, for performance-sensitive flows.

---

## 15. Accessibility and Platform Polish

- Use accessible labels, roles, hints, and state where appropriate.
- Make interactive controls comfortably tappable; target approximately 44–48 dp where practical.
- Never rely on color alone to communicate status or errors.
- Maintain readable contrast and support system font scaling unless there is a strong, justified product constraint.
- Provide meaningful accessibility labels for icon-only buttons and images.
- Ensure screen-reader order follows the visual hierarchy.
- Respect safe areas, keyboard behavior, and platform conventions on both iOS and Android.
- Test Android back behavior, permission denial, interrupted flows, and app resume behavior.
- Avoid unnecessary haptics, animations, or permission prompts.
- Use platform-specific code only when behavior genuinely needs to differ, and keep the shared experience consistent.

---

## 16. Authentication, Session, and App Lifecycle

If authentication exists:

- Centralize session handling and document the token/session lifecycle.
- Ensure concurrent `401` responses do not trigger multiple conflicting refresh operations.
- Handle refresh failure by safely clearing the session and routing the user to re-authenticate.
- Clear user-specific query caches and Zustand state on logout or account switch.
- Avoid displaying one user's cached data after another user signs in.
- Define behavior for app cold start, resume, expired sessions, and offline startup.
- Never rely solely on a local role or client-side flag to authorize sensitive actions.

Do not implement authentication assumptions until the backend's actual flow is known.

---

## 17. Environment Configuration and Builds

- Keep development, preview/staging, and production configuration distinct.
- Validate required environment variables early and fail clearly when essential configuration is missing.
- Never commit secrets or real production credentials.
- Use `.env.example` with safe placeholder values and document required variables.
- Keep API base URLs environment-specific and out of screen/service feature logic.
- Follow the repository's Expo app configuration and EAS Build conventions where applicable.
- Verify package compatibility with the project's Expo SDK before installation or upgrades.
- Do not edit native folders or config plugins casually; understand whether the project uses Continuous Native Generation and what a change will affect.
- Test release-like builds for issues that do not appear in Expo Go or development mode.
- Ensure app identifiers, icons, splash screen, permissions, deep links, and versioning are configured intentionally before release.

---

## 18. Testing Requirements

Write tests proportional to risk and complexity.

- **Unit tests:** pure functions, validation, formatting, business rules, and state transitions.
- **Service tests:** endpoint behavior, request parameters, error mapping, and response parsing.
- **Hook tests:** query/mutation behavior where practical.
- **Component tests:** important interactions, validation messages, loading/error/empty states.
- **Integration/E2E tests:** critical journeys such as sign-in, core workflows, payments, uploads, or other high-risk operations when applicable.

Rules:

- Test meaningful behavior, not implementation details alone.
- Include success and failure cases.
- Cover edge cases such as missing data, slow requests, duplicate taps, expired sessions, and offline behavior where relevant.
- Do not mock away the entire behavior that the test is supposed to verify.
- Do not weaken or delete tests merely to get a green run.
- Add regression tests for fixed bugs when practical.
- Never claim tests passed unless they were executed and passed.

---

## 19. Code Quality and TypeScript Standards

- Keep strict TypeScript settings enabled where feasible.
- Define types for API requests/responses, route parameters, store state, component props, and domain entities.
- Prefer discriminated unions for state that has mutually exclusive variants.
- Use `unknown` instead of `any` for untrusted values, then narrow safely.
- Avoid non-null assertions (`!`), unsafe casts, `@ts-ignore`, and `@ts-nocheck`. If unavoidable, explain and isolate the reason.
- Avoid magic strings/numbers; use named constants or design tokens where appropriate.
- Prefer pure functions for transformations and business rules.
- Keep functions short and names specific.
- Use consistent naming: components in `PascalCase`, hooks starting with `use`, and functions/variables in `camelCase`.
- Remove dead code, unused imports, commented-out implementations, temporary flags, and debug statements.
- Do not add broad lint suppressions. Fix the underlying issue or document a narrowly scoped exception.
- Avoid duplicated logic; refactor repeated behavior into a suitable shared abstraction.
- Do not over-engineer. Choose the simplest design that remains safe, testable, and maintainable.

---

## 20. Product and UX Standards

For every feature, think through the entire user journey:

- What does the user see before data arrives?
- What happens if there is no data?
- What happens if the network is slow, offline, or returns an error?
- What happens if the user taps twice?
- What happens if the app is backgrounded and resumed?
- What happens if permissions are denied?
- What happens on a small screen or with large text?
- What happens if a session expires mid-flow?
- Can the user recover without losing their work?
- Is the primary action obvious, and is destructive behavior clear?

Use concise, human language. Avoid raw backend messages and generic “Something went wrong” errors when a more useful message is possible. Make interactions feel immediate while preserving correctness.

---

## 21. Implementation Workflow for Every Feature

Follow this sequence:

1. **Inspect:** Read the relevant screen, components, API contract, types, theme, and existing tests.
2. **Plan:** List the files to add/change and the expected user-visible behavior.
3. **Contract first:** Register verified API endpoints and define request/response types.
4. **Service:** Implement the domain service using the shared API client.
5. **Query/state:** Add query keys and TanStack Query hooks for server state; use Zustand only for shared client state.
6. **UI components:** Build reusable or feature-local components using NativeWind and centralized theme tokens.
7. **Screen:** Compose the screen from smaller components. Keep it under the component-size limits.
8. **States:** Add loading, success, empty, error, disabled, and retry behavior as appropriate.
9. **Accessibility/security:** Check permissions, input validation, sensitive data, and accessible interactions.
10. **Verify:** Run relevant type checks, lint, tests, and project checks. Fix regressions.
11. **Review:** Inspect the diff for duplication, over-sized components, hardcoded tokens/endpoints, unsafe types, and unrelated edits.
12. **Summarize:** Report the implementation, files changed, checks performed, and remaining blockers.

Do not skip the service layer or put API calls directly into UI components to save time.

---

## 22. Definition of Done

A feature is **not complete** until all applicable items below are satisfied:

- [ ] Existing architecture and API contracts were inspected.
- [ ] Endpoints are registered centrally and use verified paths.
- [ ] Every backend operation uses a typed domain service.
- [ ] TanStack Query manages server state and cache behavior.
- [ ] Zustand is used only for justified client-side state.
- [ ] Theme values are centralized and used consistently.
- [ ] NativeWind is used correctly for supported styling.
- [ ] Screen files and feature modules have clear responsibilities.
- [ ] Components over 300 lines were reviewed for extraction; avoid exceeding 350 lines without a strong reason.
- [ ] Loading, empty, error, retry, and mutation states are implemented as applicable.
- [ ] Form validation, duplicate-submit protection, and error messages are correct.
- [ ] Accessibility, safe areas, keyboard behavior, and small screens were considered.
- [ ] Secrets and sensitive information are not exposed or logged.
- [ ] No unnecessary dependencies, unsafe casts, debug logs, or unrelated changes were introduced.
- [ ] Relevant type checks, linting, tests, and project checks were run where available.
- [ ] Remaining failures or unverified behavior are reported honestly.

---

## 23. Final Instruction to the AI Agent

Act like a senior React Native engineer responsible for a real production app with real users—not like a code generator trying to finish a task as quickly as possible.

Before implementing anything, understand the existing code and contracts. Prefer clear modular architecture, typed service boundaries, reliable state management, consistent design tokens, accessible UI, defensive error handling, and verified behavior.

**Do not merely make the screen work once. Make the feature maintainable, secure, testable, resilient, and consistent with the entire app.**

When a shortcut conflicts with these rules, choose the production-grade approach. When a requirement or API contract is unknown, verify it or state the uncertainty instead of inventing details.
