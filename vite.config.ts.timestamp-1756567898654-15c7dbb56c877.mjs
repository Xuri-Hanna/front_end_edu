// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///C:/xampp/htdocs/Do_An_Tot_Nghiep/DoAn/DoAn/AdminPanel/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/xampp/htdocs/Do_An_Tot_Nghiep/DoAn/DoAn/AdminPanel/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwind from "file:///C:/xampp/htdocs/Do_An_Tot_Nghiep/DoAn/DoAn/AdminPanel/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/xampp/htdocs/Do_An_Tot_Nghiep/DoAn/DoAn/AdminPanel/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\Do_An_Tot_Nghiep\\DoAn\\DoAn\\AdminPanel";
var vite_config_default = defineConfig(({ mode }) => {
  const rootDir = path.resolve(__vite_injected_original_dirname, "src");
  const env = loadEnv(mode, process.cwd(), "");
  const production = env.NODE_ENV === "production";
  return {
    root: rootDir,
    base: "/",
    appType: "spa",
    plugins: [
      vue()
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwind()
        ]
      }
    },
    resolve: {
      alias: {
        "@": rootDir
      }
    },
    build: {
      minify: production,
      sourcemap: production,
      outDir: path.resolve(rootDir, "..", "dist")
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcRG9fQW5fVG90X05naGllcFxcXFxEb0FuXFxcXERvQW5cXFxcQWRtaW5QYW5lbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXERvX0FuX1RvdF9OZ2hpZXBcXFxcRG9BblxcXFxEb0FuXFxcXEFkbWluUGFuZWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3hhbXBwL2h0ZG9jcy9Eb19Bbl9Ub3RfTmdoaWVwL0RvQW4vRG9Bbi9BZG1pblBhbmVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSAndGFpbHdpbmRjc3MnXHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IHJvb3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyk7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcbiAgY29uc3QgcHJvZHVjdGlvbiA9IGVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcm9vdDogcm9vdERpcixcclxuICAgIGJhc2U6ICcvJyxcclxuICAgIGFwcFR5cGU6ICdzcGEnLFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoKSxcclxuICAgIF0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcG9zdGNzczoge1xyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgIGF1dG9wcmVmaXhlcigpLFxyXG4gICAgICAgICAgdGFpbHdpbmQoKSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHJvb3REaXIsXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBtaW5pZnk6IHByb2R1Y3Rpb24sXHJcbiAgICAgIHNvdXJjZW1hcDogcHJvZHVjdGlvbixcclxuICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUocm9vdERpciwgJy4uJywgJ2Rpc3QnKSxcclxuICAgIH0sXHJcbiAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVixPQUFPLFVBQVU7QUFDaFgsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUp6QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLFVBQVUsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFDN0MsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sYUFBYSxJQUFJLGFBQWE7QUFFcEMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLElBQ047QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVM7QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsUUFBUSxLQUFLLFFBQVEsU0FBUyxNQUFNLE1BQU07QUFBQSxJQUM1QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
