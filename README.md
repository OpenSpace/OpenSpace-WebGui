# OpenSpace WebGUI

This is the repository for the new WebGui User Interface for OpenSpace, which replaces the one in [this repository](https://github.com/OpenSpace/OpenSpace-WebGuiFrontend)

It is built using [Vite](https://vite.dev/) and written in React TypeScript. We're using Prettier and ESLint for code formatting.

## Develop

```sh
# install dependencies
npm install
#run development app
npm run dev
# open gui
open http://localhost:4690
```

## Additional Scripts
The following steps create a build that will be placed in a folder `dist` which can be deployed.

```sh
# build frontend
npm run build

# test the built version of the frontend locally
npm run build
npm run preview
```

Format code using Prettier and ESLint

```sh
# Preview changes - Will output a list of changes necessary to adhere to the rules
npm run lint
# Many required changes can automatically be fixed using:
npm run lint-fix

# If you, for some reason, don't want to run both at the same time, you can:

# Run Prettier
npx prettier . --check
# Or to automatically fix issues
npx prettier . --write

# Run ESLint
npx eslint .
# Or to automatically fix issues
npx eslint . --fix

# To find ESLint rules that are unnecessary or conflict with Prettier rules, run:
npm run rule-check
```

## Components

We are using a component library called [Mantine](https://mantine.dev). These components fulfill accessibility requirements and come with correct styling out of the box. Use these as much as possible when writing your own React components.
We apply a custom theme to the Mantine components. If you are building a separate webpage and want the same styling, copy the theme from `src/app/theme/mantineTheme.ts`.

  - A fork of [`rc-dock`](https://github.com/OpenSpace/OpenSpace-WebGui-WindowLayout) is used for window management. It is slightly customized to fit our needs.
  - [`tanstack/virtual`](https://tanstack.com/virtual/latest/docs/introduction) is used for virtualized lists.
  - [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd) is used for drag-and-drop lists.

## Guidelines

  - Make sure the code adheres to ESLint and Prettier rules - Run the necessary commands (see Additional Scripts) before pushing code.
  - If you need to disable an ESLint or Prettier rule, there needs to be a comment explaining why
  - Do not use type `any` unless absolutely necessary, add a comment explaining why `any` is used over a specified type
  - Prefer default styling as much as possible when using Mantine components.
  - Use `Props` over `Style` objects when adding custom styling to components.
  - Import using the `@` notation e.g., `import { InfoBox } from '@/components/InfoBox/InfoBox'` as much as possible. Relative paths can be used for child or sibling components e.g., `import { PlayBackButton } from './PlayBack/PlayBackButton'`
  - Avoid passing JSX as props, function arguments, or return values unless absolutely necessary, and only if the JSX is small.
  - Avoid storing JSX in variables unless necessary.
  - If a component becomes complex, consider breaking it into smaller components and/or leveraging hooks.
  - As much as possible, adhere to accessibility standards for contrast, keyboard navigation, etc. See [additional information](https://docs.openspaceproject.com/latest/contribute/development/ui-accessibility.html).

  - Follow the **Hooks Order** as much as possible.

## Guide: how to add a new panel

  - Create a panel by making a new component and place it in a folder in the `src/panels` folder. The folder name should be the same as the component name. For example, if you create a new panel called `MyPanel`, create a folder called `MyPanel` and place the component in there. The panel name should end with "Panel": `MyPanel` is okay, but `MyComponent` is not.
  - Hooks, types, and util functions that are only used in that panel can be placed in the same folder. If you have a lot of files, consider creating subfolders for hooks, types, and utils.
  - Include the panel in `src/windowmanagement/data/LazyLoads.tsx` and `src/windowmanagement/data/MenuItems.tsx`. This will make it appear in the menus.
  - We also need to add the panel to the OpenSpace Launcher. To do this, save a layout file by clicking `View > Save Toolbar Settings` and overwrite the JSON file at `OpenSpace > data > web > default_ui_panels.json`.
  - This change in the engine needs to be committed to an engine branch.
  - Done!

### Hooks Order

  - For cleaner code, we adhere to the following **hooks order** whenever possible. In some situations, a hook is derived from a "lower order" hook, in which case the order can be swapped.
  - Order:
    - useTranslation
    - useAppSelector
    - useState
    - useContext
    - useRef
    - customHooks (useOpenSpaceApi, etc)
    - derived state
    - useAppDispatch
    - useEffect
    - useMemo, useCallback
    - functions

## A note on arrow function returns
Use the implicit return only when something actually is returned; for example:

```ts
// ✅
const double = n => n * 2;
const getLabel = user => user.name;
const doubled = nums.map(n => n * 2);
```

If the function doesn't return anything meaningful, always use a function body with no `return` statement.

```ts
// ❌ Avoid — implicit return on a function that isn't meant to return a value
users.forEach(user => updateUser(user));

// ✅ Better — intent is clear, no accidental return
users.forEach(user => {
  updateUser(user);
});
```

### Exception: JSX event handlers
Inline arrow functions in JSX props (e.g. onClick) may use a concise body if they contain a single expression. In this case, it's already clear that the function is not returning a value.

```jsx
// ✅ This is ok even though updateValue does not return anything
<Component onClick={() => updateValue(!checked, isImmediate)} />
```

Use a block body ({}) if there are multiple statements or any control flow.

## OpenSpace JavaScript API
We use the TypeScript version of our [JavaScript API](https://github.com/OpenSpace/openspace-api-js) as a regular npm dependency (`openspace-api-js`). Since the API is frequently updated with new OpenSpace Lua functions and Topics, the types published to npm can lag behind a given OpenSpace build - in that case, you can build and test a local version of `openspace-api-js` before a new release is published.

To try out new or updated types:
1. Check out the [openspace-api-js](https://github.com/OpenSpace/openspace-api-js) repository and generate the types you need. See its [Generating types from your OpenSpace build](https://github.com/OpenSpace/openspace-api-js#generating-types-from-your-openspace-build) section, (`npm run generate-topic-types` for Topics, `npm run generate-lua-library` for Lua library functions).
1. In the `openspace-api-js` repository, run `npm pack` to create a local tarball (`openspace-api-js-x.x.x.tgz`).
1. In this repository, run `npm install <path-to-openspace-api-js-x.x.x.tgz>` to install it as a local dependency and verify the new types work as expected.
1. Once verified, publish a new version of `openspace-api-js` to npm. See [Publish a new npm version](https://docs.openspaceproject.com/releases-v0.22/contribute/development/index.html) for the full publishing steps, then update the `package.json` here to point at `openspace-api-js@dev` (or a specific `-dev.x` version) and commit the change.
1. When the `openspace-api-js` change is promoted to a stable release, we can bump the dependency in `package.json` to that version and commmit.

## Deploy
TODO Steps:
