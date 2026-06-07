"use client";

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const cacheLoadedAssets = async () => {
      const registration = await navigator.serviceWorker.ready;
      const worker =
        registration.active ?? registration.waiting ?? registration.installing;

      if (!worker) return;

      const urls = Array.from(
        document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>(
          'link[href], script[src]'
        )
      )
        .map((element) =>
          "href" in element ? element.href : element.src
        )
        .filter((url) => url.startsWith(window.location.origin))
        .map((url) => new URL(url).pathname);

      worker.postMessage({
        type: "CACHE_URLS",
        urls: Array.from(new Set(["/", ...urls])),
      });
    };

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
        await cacheLoadedAssets();
      } catch {
        // Offline support should never block the game if registration fails.
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
