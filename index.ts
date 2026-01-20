import { globSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { parse } from "jsonc-parser";

const isValidExtension = (filename: string) =>
	filename.endsWith(".json") || filename.endsWith(".jsonc");

//-------- Parse Args
const { values, positionals } = parseArgs({
	options: {
		write: {
			type: "boolean",
			short: "w",
			default: false,
		},
	},
	allowPositionals: true,
	strict: true,
});

//-------- Get files from glob
let files: string[] = [];
if (positionals.length === 0) {
	console.error("Error: <glob> argument is required");
	console.error("Usage: npm run json2const [--write] <glob>");
	process.exit(1);
} else if (positionals.length === 1 && positionals[0]) {
	// Treat the positional argument as a glob pattern
	// This can occur either when:
	// 1. A single unquoted file path is provided (e.g. data/input.json)
	// 2. A string quoted glob pattern is provided (e.g. "data/**/*.json")
	console.log("Glob pattern:", positionals[0]);
	files = globSync(positionals[0]).filter(isValidExtension);
	console.log(`Found ${files.length} JSON files.`);
} else {
	// This case typically occurs when the user provided an unquoted glob pattern
	// that the shell expanded into multiple file paths.
	// e.g. data/*.json becomes ["data/file1.json", "data/file2.json", ...]
	files = positionals.filter(isValidExtension);
	console.log("Multiple files provided:", files);
}
console.log("Write mode:", values.write);

//-------- Process all files prior to writing to avoid partial writes on error
const tsContent = files.map((jsonFile) => {
	const jsonData = readFileSync(jsonFile, "utf-8");
	const parsedData = parse(jsonData);
	const tsData = `export const DATA = ${JSON.stringify(parsedData, null, 4)} as const;\n\n export default DATA;\n`;
	return { tsFilePath: `${jsonFile}.ts`, tsData };
});

//-------- Write or output all files
tsContent.forEach(({ tsFilePath, tsData }) => {
	if (values.write) {
		writeFileSync(tsFilePath, tsData, "utf-8");
		console.log(`Written: ${tsFilePath}`);
	} else {
		console.log(`--- ${tsFilePath} ---\n${tsData}`);
	}
});
