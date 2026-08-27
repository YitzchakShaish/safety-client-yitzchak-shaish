/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the safety API server. Must match the server's PORT. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
