# json2const
CLI tool that generates typescript files from static JSON

## Description

This tool reads a JSON file and generates a TypeScript file that exports the JSON data as a constant with an appropriate type definition.

While TypeScript can infer types from JSON files using [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule), it infers the type of
the values as general types (e.g. `status: string` ) rather than literal values of a union type (e.g. `status: "success" | "failure" | "pending"`).

This tool generates TypeScript files that use literal types, which can be useful for ensuring type safety when working with static JSON data.

## Installation

```bash
# bun
bun add -D json2const
# npm
npm install --save-dev json2const
# yarn
yarn add --dev json2const
# pnpm
pnpm add -D json2const
```

## Usage

```bash
# bun
bun run json2const <glob-pattern> [--write]]
# npm
npm run json2const <glob-pattern> [--write]]
# yarn
yarn json2const <glob-pattern> [--write]]
# pnpm
pnpm json2const <glob-pattern> [--write]]
```

### Arguments
- `<glob-pattern>`: A glob pattern of files to process (e.g. `data/*.json`)
  - Quoted patterns (e.g. `"data/*.json"`) are expanded by Nodes's `globSync` function
  - Unquoted patterns (e.g. `data/*.json`) are expanded by the shell and are assumed to be valid file paths
  - Pattern results are then filtered to only include files that end with `.json`/`.jsonc`
- `--write`: If provided, the generated TypeScript files will be written to disk. If not provided, the generated content will be printed to the console.

Note: No arguments are provided for formatting options. It is recommended to use a code formatter such as Prettier to format the generated files.

## Example

Given a JSON file `responses.json`:

```json
[
    {
        "status": "success",
        "code": 200,
        "data": {
            "id": 1,
            "name": "John Doe"
        }
    },
    {
        "status": "failure",
        "code": 404,
        "data": null
    }
]
```
Running the command:

```bash
bun run json2const --write response.json
```
Will generate a TypeScript file `responses.json.ts`:

```typescript
export const DATA = [
    {
        status: "success",
        code: 200,
        data: {
            id: 1,
            name: "John Doe"
        }
    },
    {
        status: "failure",
        code: 404,
        data: null
    }
 ] as const;

 export default DATA;
```

The generated file exports a named constant `DATA` as well as a default export.
The default export allows you to switch your code to use the generated file with minimal changes to your code
```diff
- import responses from './responses.json';
+ import responses from './responses.json.ts';
```

The suggested way to then make use of the generated file is to import the constant and derive types from it:

```typescript
// responseUtils.ts
import responses from './responses.json.ts';

type Response = (typeof responses)[number];
type ResponseStatus = Response['status']; // "success" | "failure"

function isResponseSuccess(response: Response): boolean {
    return response.status === "success";
}

const RESPONSE_CODE_TEXT: { [key: Response['code']]: string } = {
    200: "OK",
    404: "Not Found"
}
```
