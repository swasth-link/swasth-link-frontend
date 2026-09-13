import { apiClient } from "@/app/lib/api/apiClient";

export async function registerUser(data) {
  return apiClient("/api/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return apiClient("/api/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}