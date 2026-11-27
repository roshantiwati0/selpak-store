import type { NextConfig } from "next";

/* GitHub Pages (npm run build:pages): site ko saadi HTML files me banata hai (folder "out"), kyunki Pages par
   koi server nahi chalta. Site wahan https://<user>.github.io/selpak-store/ par hoti hai, isliye har raaste ke
   aage "/selpak-store" lagta hai (basePath), aur pictures jaisi hain waisi di jaati hain (Pages unhe chhota nahi kar sakta). */
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
      // sitemap.ts aur robots.ts (jo .ts hain) is build me chhod diye jaate hain: saadi HTML wala build unhe
      // bina alag setting ke nahi bana sakta, aur demo site ko unki zarurat nahi.
      pageExtensions: ["tsx"],
    }
  : {
      // Apne server par: tez page badalna. Saadi HTML wale build me yeh dono chal nahi sakte, isliye wahan band hain.
      cacheComponents: true,
      partialPrefetching: true,
    };

export default nextConfig;
