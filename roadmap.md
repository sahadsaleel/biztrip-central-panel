HireD Admin Portal — Project Refactoring, Architecture & Cleanup
================================================================

Act as a senior React developer. Refactor and organize my existing **HireD Admin Portal** project into a clean, scalable, maintainable structure.

1\. First, Inspect the Existing Project
---------------------------------------

Before making changes, inspect the entire project, including:

- src/ and all nested folders

- public/

- package.json and package-lock.json

- TypeScript and Vite configuration files

- ESLint and Prettier configuration files

- .gitignore and .npmrc

- components.json

- AGENTS.md, README.md, and roadmap.md

- Existing routes, pages, components, hooks, types, utilities, and mock data

- Existing dependencies and scripts

Understand the current implementation before changing anything.

**Important:** Do not blindly replace the existing project. Preserve working features, existing UI, useful components, and current business logic.

2\. Clean Up Unnecessary Files
------------------------------

Review the root directory and all project folders. Identify files that are unused, duplicated, outdated, or unnecessary.

Examples from the current project include:

- .prettierignore

- .prettierrc

- eslint.config.js

- components.json

- AGENTS.md

- README.md

- roadmap.md

- .npmrc

- tsconfig.json

- vite.config.ts

- vitest.config.ts

- Generated folders such as .tanstack/ and dist/

Do not assume these files are unnecessary just because they are configuration, documentation, or generated files.

Follow these rules:

1.  Remove a file only after verifying that it is unused, redundant, or unnecessary for the final project.

2.  Keep required configuration files and anything referenced by the build, scripts, tooling, or framework.

3.  If .prettierignore is unnecessary because the project does not use Prettier or another file already covers its purpose, remove it. Otherwise, keep it.

4.  If .prettierrc is required for the project's formatting setup, keep it. Remove it only if Prettier is not used and the configuration is unnecessary.

5.  Keep eslint.config.js if ESLint is used by the project.

6.  Keep tsconfig.json and vite.config.ts when required by TypeScript and Vite.

7.  Keep vitest.config.ts if Vitest is used for testing.

8.  Keep components.json if the project uses shadcn/ui or tooling that depends on it.

9.  Review AGENTS.md, README.md, and roadmap.md. Preserve useful instructions and documentation. Remove outdated or redundant documentation only when it is safe to do so.

10. Keep .gitignore and .npmrc when needed.

11. Do not manually edit package-lock.json to remove dependencies. Update dependencies through npm commands when necessary.

12. Do not delete node\_modules/ unless there is a clear reason.

13. Remove generated folders such as dist/ or .tanstack/ only when they are safely regenerable and not required as committed project assets.

14. Remove unused dependencies only after checking imports, scripts, configuration, and actual usage.

Before deleting anything, understand its purpose. Avoid unnecessary cleanup that creates additional work or breaks the project.

3\. Project Requirements
------------------------

- Project name: stackFiveAdmin

- Application: HireD Admin Portal

- Framework: React

- Language: TypeScript

- Build tool: Vite

- Styling: Preserve the existing styling system, including Tailwind CSS if already configured.

- Scope: Frontend only

- Data: Dummy/mock data

- State: React state and local mock data

- No backend integration

- No real API requests

- No database integration

- No real authentication service

Do not migrate the project to another framework or replace the existing stack without a strong technical reason.

4\. Target Folder Architecture
------------------------------

Organize the existing project toward this structure. Adapt it to the actual implementation instead of creating empty files or folders just to match the example.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   stackFiveAdmin/  ├── public/  ├── src/  │   ├── app/  │   │   ├── router.tsx  │   │   └── providers/  │   │       └── AppProvider.tsx  │   ├── config/  │   │   └── app.config.ts  │   ├── constants/  │   │   ├── routes.ts  │   │   └── app.constants.ts  │   ├── types/  │   │   ├── common.types.ts  │   │   ├── user.types.ts  │   │   ├── order.types.ts  │   │   ├── trip.types.ts  │   │   ├── driver.types.ts  │   │   ├── company.types.ts  │   │   └── invoice.types.ts  │   ├── lib/  │   │   └── utils.ts  │   ├── utils/  │   │   ├── formatters.ts  │   │   └── validators.ts  │   ├── hooks/  │   ├── components/  │   │   ├── atoms/  │   │   ├── molecules/  │   │   ├── data-table/  │   │   └── layout/  │   ├── pages/  │   │   └── error/  │   ├── features/  │   │   ├── auth/  │   │   ├── dashboard/  │   │   ├── orders/  │   │   ├── trips/  │   │   ├── drivers/  │   │   ├── companies/  │   │   └── invoices/  │   ├── mocks/  │   ├── styles/  │   ├── App.tsx  │   └── main.tsx  ├── .gitignore  ├── package.json  ├── tsconfig.json  ├── vite.config.ts  └── README.md   `

### Architecture rules

- app/: application setup, router, and providers.

- config/: application configuration.

- constants/: shared constants and route paths.

- types/: reusable TypeScript interfaces and types.

- lib/: third-party library configuration and shared library utilities.

- utils/: formatting, validation, and pure helper functions.

- hooks/: genuinely reusable custom hooks.

- components/atoms/: basic reusable UI components.

- components/molecules/: reusable combinations of UI components.

- components/data-table/: reusable table functionality.

- components/layout/: sidebar, header, navigation, and application layout.

- pages/error/: not-found and other error pages.

- features/: feature-specific pages, components, hooks, and services.

- mocks/: centralized mock data where appropriate.

- styles/: global styles and theme configuration.

Inside each feature, use a consistent structure when needed:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   features/  └── orders/      ├── components/      ├── hooks/      ├── pages/      ├── services/      ├── types/      └── index.ts   `

Do not create unnecessary abstraction layers. Small features can use a simpler structure.

If the current project uses TanStack Router or other framework tooling, inspect it carefully before introducing router.tsx or replacing the routing system. Avoid duplicate routers and conflicting configurations.

5\. Admin Portal Features
-------------------------

Preserve and organize the existing HireD Admin Portal features.

### Dashboard

- KPI cards

- Enquiries pipeline

- Active trips and SLA status

- Accounts requiring attention

- Recent activities

### Orders

- Orders list and search

- Filtering and status updates

- Manual phone order intake

- Order details

- Reject order with a reason

### Trips

- Trips list and trip details

- Assign available drivers

- Filter drivers by availability and vehicle class

- Update trip status using local state

### Drivers

- Driver list and details

- KYC document preview using dummy data

- Approve or reject driver applications

- Show approval status

### Companies

- Company list and company details

- Fleet information

- Commission split configuration

- Validate that commission percentages total 100%

### Invoices

- Invoice list and details

- Invoice status and payment information

- Two-step admin sign-off

- The second approval must come from a different admin than the first

- Simulate approval using mock users and local state

### Authentication

- Use mock login data if login functionality already exists or is required.

- Simulate admin roles on the frontend.

- Add simple route protection if needed.

- Do not connect to a real authentication provider.

6\. Frontend-Only Behavior
--------------------------

All features must work with local dummy data.

- Use mock objects and arrays.

- Use React state for interactive changes.

- Make search and filters functional.

- Make forms validate required fields.

- Make buttons perform their expected frontend actions.

- Show success and error feedback where appropriate.

- Use mock role permissions where required.

- Persist data in local storage only if useful for the existing demo.

Do not add Axios requests, fetch requests, backend services, database connections, or real API integrations.

If existing files contain API clients or service modules, inspect them. Convert them to mock-based frontend logic where appropriate while preserving the public interfaces that the UI depends on.

7\. UI and Design
-----------------

Use the provided HireD reference screenshots as the design reference.

- Preserve the existing visual identity and useful design elements.

- Maintain a professional B2B operations dashboard style.

- Keep the sidebar, header, cards, tables, status badges, and page layouts consistent.

- Use reusable components instead of repeating the same UI.

- Ensure responsive layouts for desktop, tablet, and mobile.

- Provide loading, empty, and error states where appropriate.

- Do not redesign the entire application unnecessarily.

8\. Code Quality
----------------

- Use clear TypeScript types instead of unnecessary any.

- Remove unused imports and variables.

- Avoid duplicate components and duplicated business logic.

- Use consistent naming conventions.

- Keep components reasonably small and focused.

- Avoid circular imports.

- Use shared components where they genuinely improve maintainability.

- Preserve the current linting, formatting, and testing conventions where practical.

- Do not add packages unless they provide a clear benefit.

9\. Safe Refactoring Process
----------------------------

Work in this order:

1.  Inspect the current repository and identify the existing architecture.

2.  Identify the current framework, routing system, styling system, scripts, and dependencies.

3.  Identify unused or redundant files and configuration.

4.  Create a migration plan that preserves existing behavior.

5.  Refactor files into the target architecture.

6.  Update import paths and routing.

7.  Convert unnecessary API-dependent behavior to mock-based frontend behavior.

8.  Remove only verified unnecessary files and dependencies.

9.  Update documentation to match the actual project.

10. Run the available build, lint, and test commands.

11. Fix errors caused by the refactoring.

12. Review the final folder structure and verify that the application still works.

Do not stop after writing a plan. Implement the changes in the existing project.

10\. Final Verification
-----------------------

Run the appropriate commands based on the scripts available in package.json, such as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build  npm run lint  npm run test   `

Do not assume all three scripts exist. Inspect the available scripts first and run the applicable ones.

If a command fails, investigate and fix issues caused by your changes. Clearly report any remaining pre-existing issues.

11\. Final Report
-----------------

When finished, provide:

1.  The updated folder structure.

2.  The main files created, moved, updated, or deleted.

3.  The unnecessary files removed and why they were safe to remove.

4.  Any dependencies removed or added and the reasons.

5.  The features preserved or updated.

6.  The build, lint, and test results.

7.  Any remaining issues or manual steps.

**Final priority:** Keep the existing HireD Admin Portal working, organize it into a clean and scalable architecture, remove only genuinely unnecessary files, and keep the application frontend-only with dummy data.
