const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de la connexion");

  localStorage.setItem("token", data.accessToken);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // refreshToken
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

  localStorage.setItem("token", data.accessToken); // garder un comportement uniforme
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}
