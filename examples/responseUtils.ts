import type rawData from "./responses.json";
import type safeData from "./responses.json.ts";

// Example of type errors from using the raw JSON data directly
export type RawResponse = (typeof rawData)[number];
export type RawResponseStatus = RawResponse["status"]; // string

export function handleRawResponse(response: RawResponse) {
	// The following line would cause a TypeScript error because
	// rawData does not have the 'as const' assertion
	// and thus TypeScript cannot narrow the types correctly.
	if (response.status === "success") {
		// @ts-expect-error
		console.log("User First Name:", response.data.firstName);
		// @ts-expect-error
		console.log("User Last Name:", response.data.lastName);
		// @ts-expect-error
		console.log("User DOB:", response.data.dob);
	} else {
		// @ts-expect-error
		console.error(`Error ${response.error.code}: ${response.error.message}`);
	}
}

// Example usage of the generated DATA constant and its type
export type Response = (typeof safeData)[number];
export type ResponseStatus = Response["status"]; // "success" | "error"

export function handleResponse(response: Response) {
	// Here, TypeScript can correctly narrow the types to see that
	// when status is "success", data is present, and when status is "error", error is present.
	if (response.status === "success") {
		console.log("User First Name:", response.data.firstName);
		console.log("User Last Name:", response.data.lastName);
		console.log("User DOB:", response.data.dob);
	} else {
		console.error(`Error ${response.error.code}: ${response.error.message}`);
	}
}
