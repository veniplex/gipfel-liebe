# Project Overview

- **Project Name**: Gipfel Liebe
- **Project Type**: Web Application
- **Project Description**: A central hub for families and couples with helpful tools for managing their life.

# Project Core Instructions

## 1. Interaction & Languages

- **Agent Language**: Antigravity interacts with the user exclusively in **German**.
- **Project Language**: All code, comments, UI text, and documentation within the project must be in **English**.
- **Tone**: Professional, helpful, and proactive.

## 2. Technical Architecture & Performance

- **Framework**: Svelte 5 (Runes: `$state`, `$derived`, `$props`) and SvelteKit.
- **State Management**: Use Svelte 5 runes for local and shared state.
- **Offline / PWA**: The application should work 100% offline as a Progressive Web App (PWA).
- **Local Storage**: All data must be stored locally in the user's browser (LocalStorage). No external database dependencies.
- **Type Safety**: Mandatory TypeScript for all logic, components, and data structures.
- **Performance & Security**: Follow modern best practices (fast load times, secure data handling, semantic HTML).
- **SvelteKit Native**: Prioritize Loaders, Actions, and API routes.
- **Responsive Design**: Use TailwindCSS for responsive design.
- **UI Components**: Use daisy-ui components for all UI elements. See the documentation at [daisyui.com](https://daisyui.com/llms.txt).

## 3. UI & Styling

- **daisy-ui Primacy**: Use daisy-ui components for all UI elements. Ref: [daisyui.com](https://daisyui.com/llms.txt).
- **TailwindCSS**: Use TailwindCSS for custom styling.
- **CSS Policy**: Plain CSS is strictly prohibited, except for custom styling which is not possible with TailwindCSS.
- **Consistency**: Maintain a unified UI and UX.
- **Icons**: Use [unplugin-icons](https://github.com/unplugin/unplugin-icons) for all iconography.

## 4. Modularity & Clean Code

- **Component-Driven**: Small, reusable components.
- **File Management**: Refactor large components into sub-components.
- **MCP Usage**: Always use the Svelte MCP server (`list-sections`, `get-documentation`, `svelte-autofixer`) to ensure Svelte 5 best practices.

### 4.1 Agent Guidelines for Svelte MCP

- **Always Explore First**: Use `list-sections` to find relevant docs before starting complex Svelte tasks.
- **Code Quality**: Run `svelte-autofixer` on every component before delivery until no issues remain.
- **Playground**: Offer a Svelte Playground link for external testing when requested (not for project files).
