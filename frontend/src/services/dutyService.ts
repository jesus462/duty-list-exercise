import { API_BASE_URL } from "../utils/constants";
import type { CreateDutyRequest, UpdateDutyRequest, Duty } from "./types";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.error || "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return (await response.json()) as T;
};

/**
 * Fetches the list of duties from the backend API.
 * @returns An array of duties
 * @throws Error when the request fails
 */
export const fetchDuties = async (): Promise<Duty[]> => {
  const response = await fetch(`${API_BASE_URL}/duties`);
  return handleResponse<Duty[]>(response);
};

/**
 * Creates a new duty via the backend API
 * @param payload - Data for the new duty
 * @returns The created duty
 * @throws Error when the request fails
 */
export const createDuty = async (payload: CreateDutyRequest): Promise<Duty> => {
  const response = await fetch(`${API_BASE_URL}/duties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Duty>(response);
};

/**
 * Updates an existing duty via the backend API
 * @param id - The ID of the duty to update
 * @param payload - Updated data for the duty
 * @returns The updated duty
 * @throws Error when the request fails
 */
export const updateDuty = async (
  id: number,
  payload: UpdateDutyRequest
): Promise<Duty> => {
  const response = await fetch(`${API_BASE_URL}/duties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Duty>(response);
};

/**
 * Deletes a duty via the backend API
 * @param id - The ID of the duty to delete
 * @throws Error when the request fails
 */
export const deleteDuty = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/duties/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.error || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  // DELETE returns 204 No Content, so no JSON to parse
  if (response.status !== 204) {
    throw new Error("Unexpected response from server");
  }
};
