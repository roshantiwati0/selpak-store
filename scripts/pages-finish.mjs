/* `npm run build:pages` ka aakhri kadam. Folder "out" ko GitHub Pages ke liye taiyaar karta hai:

   1. ".nojekyll" file: iske bina GitHub Pages "_" se shuru hone wale folder (_next) nahi deta aur site khali dikhti hai.
   2. Page badalne wali chhoti files: build unhe folder ke andar likhta hai (__next.login/__PAGE__.txt), par browser
      unhe ek hi naam se maangta hai (__next.login.__PAGE__.txt). Yahan har ek ki us naam wali copy bana dete hain,
      warna har link par "404 file nahi mili" aata hai aur page dheere badalta hai. */
import { copyFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
if (!existsSync(out)) {
  console.error('Folder "out" nahi mila. Pehle `next build` (GITHUB_PAGES=true) chalna chahiye.');
  process.exit(1);
}

writeFileSync(join(out, ".nojekyll"), "");

let copies = 0;

/** `dir` ke andar ki har file ko `target` folder me "<prefix>.<file>" naam se copy karta hai. */
function flatten(dir, target, prefix) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(join(dir, entry.name), target, name);
    else {
      copyFileSync(join(dir, entry.name), join(target, name));
      copies += 1;
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(full, dir, entry.name);
    else if (entry.name !== "_next") walk(full);
  }
}

walk(out);
console.log(`GitHub Pages ke liye taiyaar: out/ (.nojekyll + ${copies} page-badalne wali files)`);
