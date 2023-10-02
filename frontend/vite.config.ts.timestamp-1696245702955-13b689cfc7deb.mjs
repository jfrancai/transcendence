// vite.config.ts
import { defineConfig } from "file:///mnt/nfs/homes/jfrancai/repos/transcendence/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/nfs/homes/jfrancai/repos/transcendence/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import eslint from "file:///mnt/nfs/homes/jfrancai/repos/transcendence/frontend/node_modules/vite-plugin-eslint/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {},
  plugins: [
    react(),
    // so when you do npm run dev no crash occurs just tell you the error.
    {
      ...eslint({
        cache: true,
        failOnWarning: false,
        failOnError: false,
        exclude: ["/virtual:/**", "/node_modules/**"]
      }),
      apply: "serve",
      enforce: "post"
    }
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L25mcy9ob21lcy9qZnJhbmNhaS9yZXBvcy90cmFuc2NlbmRlbmNlL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L25mcy9ob21lcy9qZnJhbmNhaS9yZXBvcy90cmFuc2NlbmRlbmNlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvbmZzL2hvbWVzL2pmcmFuY2FpL3JlcG9zL3RyYW5zY2VuZGVuY2UvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7fSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gc28gd2hlbiB5b3UgZG8gbnBtIHJ1biBkZXYgbm8gY3Jhc2ggb2NjdXJzIGp1c3QgdGVsbCB5b3UgdGhlIGVycm9yLlxuICAgIHtcbiAgICAgIC4uLmVzbGludCh7XG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBmYWlsT25XYXJuaW5nOiBmYWxzZSxcbiAgICAgICAgZmFpbE9uRXJyb3I6IGZhbHNlLFxuICAgICAgICBleGNsdWRlOiBbJy92aXJ0dWFsOi8qKicsICcvbm9kZV9tb2R1bGVzLyoqJ11cbiAgICAgIH0pLFxuICAgICAgYXBwbHk6ICdzZXJ2ZScsXG4gICAgICBlbmZvcmNlOiAncG9zdCdcbiAgICB9XG4gIF1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLG9CQUFvQjtBQUMzVyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVEsQ0FBQztBQUFBLEVBQ1QsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTjtBQUFBLE1BQ0UsR0FBRyxPQUFPO0FBQUEsUUFDUixPQUFPO0FBQUEsUUFDUCxlQUFlO0FBQUEsUUFDZixhQUFhO0FBQUEsUUFDYixTQUFTLENBQUMsZ0JBQWdCLGtCQUFrQjtBQUFBLE1BQzlDLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQSxNQUNQLFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
