import type rawData from "./responses.json";
import type safeData from "./responses.json.ts";

// Example of type errors from using the raw JSON data directly
export type RawResponse = (typeof rawData)[number];
export type RawResponseStatus = RawResponse["status"]; // string

export function handleRawResponse(response: RawResponse) {
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
export type SafeResponse = (typeof safeData)[number];
export type SafeResponseStatus = SafeResponse["status"]; // "success" | "error"

export function handleResponse(response: SafeResponse) {
	if (response.status === "success") {
		console.log("User First Name:", response.data.firstName);
		console.log("User Last Name:", response.data.lastName);
		console.log("User DOB:", response.data.dob);
	} else {
		console.error(`Error ${response.error.code}: ${response.error.message}`);
	}
}
