/**
 * Base URL of the safety API server.
 *
 * Override per-environment with a `VITE_API_URL` entry in `.env`
 * (see `.env.example`). Falls back to the local dev server port,
 * which must match `PORT` in the server's `.env`.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";
