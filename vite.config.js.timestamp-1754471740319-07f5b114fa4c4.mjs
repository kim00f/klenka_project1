// vite.config.js
import { defineConfig } from "file:///C:/Users/aliha/Desktop/klenka_project1/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///C:/Users/aliha/Desktop/klenka_project1/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/Users/aliha/Desktop/klenka_project1/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "dist",
    emptyOutDir: false
    // <-- This prevents Vite from cleaning outDir before building to avoid loading module issue in production
  },
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        // Your Express server port
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbGloYVxcXFxEZXNrdG9wXFxcXGtsZW5rYV9wcm9qZWN0MVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWxpaGFcXFxcRGVza3RvcFxcXFxrbGVua2FfcHJvamVjdDFcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FsaWhhL0Rlc2t0b3Ava2xlbmthX3Byb2plY3QxL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjsgXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7IFxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpLHJlYWN0KCldLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSAgIC8vIDwtLSBUaGlzIHByZXZlbnRzIFZpdGUgZnJvbSBjbGVhbmluZyBvdXREaXIgYmVmb3JlIGJ1aWxkaW5nIHRvIGF2b2lkIGxvYWRpbmcgbW9kdWxlIGlzc3VlIGluIHByb2R1Y3Rpb25cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMixcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLCAvLyBZb3VyIEV4cHJlc3Mgc2VydmVyIHBvcnRcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFMsU0FBUyxvQkFBb0I7QUFDM1UsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxZQUFZLEdBQUUsTUFBTSxDQUFDO0FBQUEsRUFDL0IsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsRUFDZjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
