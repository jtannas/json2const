# json2const
CLI tool that generates typescript files from static JSON.
Inspired by https://github.com/microsoft/TypeScript/issues/32063

```bash
$ npx json2const <glob-pattern> [--write]
```

Can also be installed via `npm`/`yarn`/`pnpm`/`bun`/etc...
```bash
$ npm install json2const
$ npm run json2const <glob-pattern> [--write]
```

## Arguments
- `<glob-pattern>`: A glob pattern of files to process (e.g. `data/*.json`)
  - Quoted patterns (e.g. `"data/*.json"`) are expanded by Nodes's `globSync` function
  - Unquoted patterns (e.g. `data/*.json`) are expanded by the shell and are assumed to be valid file paths
  - Pattern results are then filtered to only include files that end with `.json`/`.jsonc`
- `--write`: If provided, the generated TypeScript files will be written to disk. If not provided, the generated content will be printed to the console.

Note: No arguments are provided for formatting options. It is recommended to use a code formatter such as Prettier to format the generated files.

## Description

When importing JSON into TypeScript, the keys are inferred as exact string types but the values are inferred as general types.
e.g. `[{ "status": "success" }, { "status": "failure" }]` is inferred as `{ status: string }[]`.

This tool generates TypeScript files that export the JSON content with an `as const` declarations.
This allows TypeScript to infer the values as exact types as well.
```ts
import responses from './responses.json.ts'; //
type ResponseStatus = (typeof responses)[number]['status']; // "success" | "failure"
```

The generated TypeScript files have the same name as the input JSON files with a `.ts` extension added.
e.g. `data.json` -> `data.json.ts`

They export the JSON content as both a default export and a named export `DATA`.
e.g. `data.json.ts`
```ts
const DATA = { ... } as const;
export default DATA;
```

This allows for easy migration from JSON imports to TypeScript imports.
```diff
- import responses from './data.json';
+ import responses from './data.json.ts';
```

## Examples

See [examples/](./examples) for sample JSON files and the generated TypeScript files.
- [examples/response.json](./examples/response.json) for the input JSON file
- `npx json2const examples/*.json --write` to generate the TypeScript files
- [examples/response.json.ts](./examples/response.json.ts) for the generated TypeScript file
- [examples/responseUtils.ts](./examples/responseUtils.ts) for a sample usage of the generated TypeScript file
