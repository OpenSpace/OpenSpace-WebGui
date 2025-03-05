# OpenSpace WebGUI Module

This is the repository for the new WebGui User Interface for OpenSpace, which replaces the one in [this repository](https://github.com/OpenSpace/OpenSpace-WebGuiFrontend)

It is built using [Vite](https:://vite.dev/) and written in React TypeScript. We're using Prettier and ESLint for code formatting.

## Develop

```sh
# install dependencies
npm install
#run development app
npm run dev
# open gui
open http://localhost:4670
```

## Additional Scripts
 Prepare for build:
 ```sh
 # build frontend
 npm run build
 ... TODO additional steps

 # test the built version of the frontend locally
 npm run build
 npm run preview
 ```

 Format code using Prettier and EsLint
 ```sh
 # Preview changes - Will output a list of changes necessary to adhere to the rules
 npm run lint
 # Many required changes can automatically be fixed using
 npm run lint-fix

 # If you for some reason don't want to run both at the same time, you can
 # Run prettier
 npx prettier . --check
 # Or to automatically fix issues
 npx prettier . --write
 # Run ESLint
 npx eslint .
 # Or to automatically fix issues
 npx eslint . --fix

 # To find ESLint rules that are unnecessary or conflict with Prettier rules, run
 npm run rule-check
 ```

## Components
We are using a component library called [Mantine](https://mantine.dev). These components fulfill accessibility requirements and have the correct styling out of the box. Use these as much as possible when writing your own React components.
We apply a custom theme to the Mantine components, if you are building a separate webpage and want the same styling, copy the theme at `src/app/theme/mantineTheme.ts`.

## Guidlines
 - Make sure the code adheres to ESLint rules and Prettier - Run the necessary commands (see Additional Scripts) before pushing code.
 - If you need to disable an ESLint or Prettier rules, there needs to be a comment explaining why
 - Do not use type `any` unless absolutely necessary, add a comment explaining why `any` is used over a specified type
 - Prefer default styling as much as possbile when using Mantine components.
 - Use `Props` over `Style` object when adding custom styling to components.
 - Import using the `@` notation e.g., `import { InfoBox } from '@/components/InfoBox/InfoBox'` as much as possible. Relative paths can be used for child or sibling components e.g., `import { PlayBackButton } from './PlayBack/PlayBackButton'`


## OpenSpace JavaScript API
we now support a TypeScript version of our [JavaScript API](https://github.com/OpenSpace/openspace-api-js), since the API updates quite frequently with new OpenSpace Lua functions we've decided to keep a manual copy of the TypeScript API in this repository. As such, we need to manually update the API declaration file from time to time, to get correct and proper syntax highlighting when calling Lua functions.

Follow the steps here (TODO: link to api-js readme describing steps to generate file)


 ## Deploy
 TODO Steps: