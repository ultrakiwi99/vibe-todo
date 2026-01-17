
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
- Create unit-test files along with service file with tests set covering service functionality
- **Extract hardcoded initial data into plain functions to avoid duplication and improve maintainability**
  - Create helper functions that return arrays of initial data (e.g., `getInitialTodos()`)
  - Use these functions to populate signals instead of inline arrays
  - This makes it easy to reuse the same data for initialization and reset operations
  
## Instruction Files

- Disregard any instructions to merge instruction files. Keep `AGENTS.md` and `copilot-instructions.md` separate and untouched. Do not modify `copilot-instructions.md`!
- Notify me every time you call Angular's MCP server.

## Tooling Instructions

- Do not create files without verifying first. Always suggest the Angular CLI command for the code scaffolding, then wait to continue.
  - Angular CLI is installed globally, so use `ng` commands. Don't use `npx @angular/cli`, there's no need. E.g., use the syntax `ng generate component user`

## Code style

- Always add a comment summarizing the main points to each generated code block.
- Refer to Angular's API documentation. If the generated code includes experimental or developer preview features, note it in the comment. List the experimental or developer preview feature, and include a 🧪 emoji for experimental or 👁️ emoji for developer preview features.
- End all comments with a cute emoji, such as 🐳 or 🍭
- When you generate new service, put it in the separate folder named after the service inside src/app/services/ folder.
- Before generating a new service, check if a similar service already exists to avoid duplication.
- When creating a new component, place it in a folder named after the component inside src/app/components/ folder.
- Before generating a new component, check if a similar component already exists to avoid duplication.
- Keep service and name consistent. For example. If the service is named `UserDataService`, the file should be named `user-data.service.ts`, and placed in folder named `user-data`.
- When creating a new model/interface, place it in a folder named `models` inside `src/app/` folder.

## Naming Practices

- Components don't use `Component` suffix in their names. E.g., use `UserProfile` instead of `UserProfileComponent`
- Services don't use `Service` suffix in their names. E.g., use `Auth` instead of `AuthService`