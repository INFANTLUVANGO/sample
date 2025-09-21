import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,    // Use your desired port
//     open: true,     // Auto open the browser
//   },
//   optimizeDeps: {
//     include: ["fullpage.js"],
//   },
// });