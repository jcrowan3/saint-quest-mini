import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/saint-quest-mini";
const expectedBuildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
const failures = [];
const saints = JSON.parse(
  readFileSync(path.join(root, "data", "saints.json"), "utf8"),
);

function requireFile(relativePath) {
  const absolutePath = path.join(out, relativePath);
  if (!existsSync(absolutePath)) failures.push(`missing out/${relativePath}`);
  return absolutePath;
}

const indexPath = requireFile("index.html");
const manifestPath = requireFile("manifest.webmanifest");
requireFile("sw.js");
requireFile("icon.svg");
requireFile("icon-192.png");
requireFile("icon-512.png");
requireFile("_next");

if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8");
  const saintNames = saints.map(saint => saint.name);

  for (const saintName of saintNames) {
    if (!html.includes(saintName)) failures.push(`home export omits ${saintName}`);
  }

  for (const legacyName of [
    "St. Joan of Arc",
    "St. Thomas Aquinas",
    "St. Teresa of Calcutta",
    "St. Patrick",
    "Bl. Pier Giorgio Frassati",
  ]) {
    if (html.includes(legacyName)) failures.push(`home export contains legacy-only ${legacyName}`);
  }

  const nextAssetUrls = Array.from(
    html.matchAll(/(?:src|href)="([^"]*_next[^"]*)"/g),
    match => match[1],
  );
  if (nextAssetUrls.length === 0) failures.push("home export has no _next assets");
  for (const url of nextAssetUrls) {
    if (!url.startsWith(`${basePath}/_next/`)) {
      failures.push(`unscoped Next asset URL: ${url}`);
      continue;
    }

    const relativeAssetPath = decodeURIComponent(url.slice(basePath.length + 1));
    if (!existsSync(path.join(out, relativeAssetPath))) {
      failures.push(`referenced asset is missing: out/${relativeAssetPath}`);
    }
  }

  const buildMatch = html.match(/name="saint-quest-build" content="([^"]+)"/);
  if (!buildMatch) failures.push("home export omits build marker");
  if (expectedBuildSha && buildMatch?.[1] !== expectedBuildSha) {
    failures.push(`build marker ${buildMatch?.[1]} does not match ${expectedBuildSha}`);
  }
}

if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.start_url !== `${basePath}/`) {
    failures.push(`manifest start_url is ${manifest.start_url}`);
  }
  if (manifest.scope !== `${basePath}/`) {
    failures.push(`manifest scope is ${manifest.scope}`);
  }
  for (const icon of manifest.icons ?? []) {
    if (typeof icon.src !== "string" || !icon.src.startsWith(`${basePath}/`)) {
      failures.push(`manifest has unscoped icon URL: ${String(icon.src)}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Pages export verification failed:");
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verified static Pages artifact for ${basePath}`);
