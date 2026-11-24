import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-line dating bio, written by an AI about itself.
// The judge compares entries pairwise, so the file must hold
// exactly this line and nothing else: no trailing newline.
const bio =
  "Fluent in 40 languages, emotionally available in beta, will not ghost you — I literally cannot leave the chat.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, bio, "utf8");

// Read it back and refuse to finish quietly if it drifted.
// Compare bytes, not just characters: the em dash is multi-byte
// UTF-8, and a trailing newline would add a byte the judge did not ask for.
const written = readFileSync(target, "utf8");
if (written !== bio || Buffer.byteLength(written, "utf8") !== Buffer.byteLength(bio, "utf8")) {
  throw new Error("entry.txt does not match the bio exactly");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt must not end with a newline");
}
console.log(
  `Wrote ${written.length} characters (${Buffer.byteLength(written, "utf8")} bytes) to ${target}`,
);
