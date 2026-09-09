import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function existingFile(candidates) {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: pathToFileURL(path.join(root, "scripts/empty-server-only.cjs")).href,
    };
  }

  if (specifier.startsWith("@/")) {
    const base = path.join(root, "src", specifier.slice(2));
    const match = existingFile([
      base,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      path.join(base, "index.ts"),
      path.join(base, "index.tsx"),
      path.join(base, "index.js"),
    ]);
    if (!match) {
      return nextResolve(specifier, context);
    }
    return {
      shortCircuit: true,
      url: pathToFileURL(match).href,
    };
  }

  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL
  ) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const base = path.resolve(parentDir, specifier);
    const match = existingFile([
      base,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      path.join(base, "index.ts"),
      path.join(base, "index.tsx"),
      path.join(base, "index.js"),
    ]);
    if (match) {
      return {
        shortCircuit: true,
        url: pathToFileURL(match).href,
      };
    }
  }

  return nextResolve(specifier, context);
}
