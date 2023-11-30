interface ImportMeta {
  env: {
    [key: string]: string | boolean;
    // Aquí puedes definir propiedades específicas si sabes cuáles serán
    // Por ejemplo:
    VITE_STEAM_API_KEY: string;
    VITE_STEAM_USER_ID: string;
    VITE_JWT_SECRET: string;
  };
}
