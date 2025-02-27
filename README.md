# OpenSpace WebGUI Module

The new WebGui is written in React TypeScript. We're using Prettier and ESLint to format the code.

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
 ... TODO additonal steps
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
 # Or to automaticall fix issues
 npx eslint . --fix

 # To find ESLint rules that unnecessary or conflicting with Prettier, run
 npm run rule-check
 ```

## Components
We are using a component library called [Mantine](https://mantine.dev), these components fulfill accessibility and have the correct styling out of the box. Use these as much as possible when writing your own React components.
We apply a custom theme to the Mantine components, if you are building a separate webpage and want the same styling, copy the theme at `src/theme/mantineTheme.ts`.

## Guidlines
 - Make sure the code adhere to ESLint rules and Prettier - Run the necessary commands (see Additional Scripts) before pushing code.
 - If you need to disable an ESLint or Prettier rules, there needs to be a comment explaining why
 - Do not use type `any` unless absolutley necessary, add a comment explaining why `any` is used over a specified type
 - Prefer default styling as much as possbile when using Mantine components.
 - Use `Props` over `Style` object when adding custom styling to components.
 - Import using the `@` notation e.g., `import { InfoBox } from '@/components/InfoBox/InfoBox'` as much as possible. Relative paths can be used for child or sibling components e.g., `import { PlayBackButton } from './PlayBack/PlayBackButton'`


 ## Deploy
 TODO Steps: