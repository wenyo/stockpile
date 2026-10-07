import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/stockpile/",
  plugins: [tailwindcss(), reactRouter(), 
    VitePWA({
    registerType: 'autoUpdate',
    injectRegister: null,
    /// 讓dev環境可以測試SW功能
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html',
      suppressWarnings: true
    },
    manifest: {
      "name": "Stockpile｜家庭防災物資管理系統・計算可支撐天數",
      "short_name": "防災物資管理",
      "icons": [
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "pwa-maskable-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa-maskable-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      "start_url": "/stockpile/",
      "display": "standalone",
      "background_color": "#373839",
      "theme_color": "#212222",
      "description": "Stockpile 是免費的家庭防災物資管理工具，可依家庭成員需求計算食物、飲水、嬰幼兒與寵物主食、必要用藥的可支撐天數，掌握物資短缺與保存期限，協助你知道目前還能撐多久、接下來最需要補充什麼。"
    },
    workbox: {
      runtimeCaching: [
       {
         urlPattern: /someInterface/i, // 接口緩存
         handler: 'CacheFirst',
         options: {
           cacheName: 'interface-cache'
         }
       },
       {
         urlPattern: /(.*?)\.(js|css|ts)/, // 靜態資源緩存
         handler: 'CacheFirst',
         options: {
           cacheName: 'js-css-cache'
         }
       },
       {
         urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 圖片緩存
         handler: 'CacheFirst',
         options: {
           cacheName: 'image-cache'
         }
       }
     ]
   }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
