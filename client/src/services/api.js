const BASE_URL = import.meta.env.VITE_API_URL;

export async function get(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Error en ${endpoint}: ${response.status}`);
  }

  return response.json();
}
