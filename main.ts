// make.fun bounty entry verifier — gta6-meme-x-01
// "Post a GTA 6 meme on X"
//
// Deterministic, zero dependencies, no network access. Reads POST.json from
// this directory, validates the X post record and the meme image, then prints
// a human-readable verification report.
//
// Usage: node main.ts
// Exit code 0 = every check passed. Exit code 1 = a check failed.
//
// The verifier never writes anything and never touches the network: it only
// reads POST.json and meme.png from its own directory.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const POST_PATH = join(DIR, "POST.json");
const MEME_PATH = join(DIR, "meme.png");

const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 675;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface PostRecord {
  bounty: string;
  author: string;
  url: string;
  caption: string;
  play_code: string;
  referral_link: string;
}

interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
}

interface PngResult {
  ok: boolean;
  width: number;
  height: number;
  error: string;
}

const results: CheckResult[] = [];

function record(name: string, ok: boolean, detail: string): void {
  results.push({ name, ok, detail });
}

function fatal(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function loadPost(): PostRecord {
  if (!existsSync(POST_PATH)) {
    fatal("POST.json is missing from this directory.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(POST_PATH, "utf8"));
  } catch (err) {
    fatal(`POST.json is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    fatal("POST.json must contain a single JSON object.");
  }
  return parsed as PostRecord;
}

function readPng(): PngResult {
  if (!existsSync(MEME_PATH)) {
    return { ok: false, width: 0, height: 0, error: "meme.png is missing from this directory." };
  }
  const buf = readFileSync(MEME_PATH);
  if (buf.length < 33) {
    return { ok: false, width: 0, height: 0, error: "meme.png is too small to be a PNG file." };
  }
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return { ok: false, width: 0, height: 0, error: "meme.png does not start with the PNG signature." };
  }
  const ihdrLength = buf.readUInt32BE(8);
  const ihdrType = buf.toString("ascii", 12, 16);
  if (ihdrType !== "IHDR" || ihdrLength !== 13) {
    return { ok: false, width: 0, height: 0, error: "meme.png has no valid IHDR chunk." };
  }
  return { ok: true, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), error: "" };
}

function main(): void {
  const post = loadPost();

  // 1. Bounty slug
  record(
    "bounty slug",
    post.bounty === "gta6-meme-x-01",
    `bounty = ${post.bounty ?? "(missing)"}`,
  );

  // 2. Author
  record(
    "author",
    typeof post.author === "string" && post.author.length > 0,
    `author = ${post.author ?? "(missing)"}`,
  );

  // 3. URL must be a canonical x.com status URL with no query string
  const urlPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/;
  const urlOk = typeof post.url === "string" && urlPattern.test(post.url);
  record("post URL", urlOk, `url = ${post.url ?? "(missing)"}`);

  // 4. Play code present
  const playCodeOk = typeof post.play_code === "string" && post.play_code.length > 0;
  record("play code present", playCodeOk, `play_code = ${post.play_code ?? "(missing)"}`);

  // 5. Referral link present and well-formed
  const referralOk =
    typeof post.referral_link === "string" &&
    /^https:\/\/make\.fun\/r\/[A-Za-z0-9]+$/.test(post.referral_link);
  record(
    "referral link present",
    referralOk,
    `referral_link = ${post.referral_link ?? "(missing)"}`,
  );

  // 6. The referral link must carry the same play code
  const referralCode = referralOk ? post.referral_link.split("/r/")[1] : "";
  const codeMatches = referralOk && playCodeOk && referralCode === post.play_code;
  record(
    "referral link uses the same play code",
    codeMatches,
    codeMatches
      ? `referral code "${referralCode}" matches play_code`
      : `referral code "${referralCode || "(missing)"}" does not match play_code "${post.play_code ?? "(missing)"}"`,
  );

  // 7. Caption non-empty, mentions the play code, the referral link and @makefunai
  const caption = typeof post.caption === "string" ? post.caption : "";
  const captionHasCode = playCodeOk && caption.includes(post.play_code);
  const captionHasLink = referralOk && caption.includes(post.referral_link);
  const captionTagsMakefun = caption.includes("@makefunai");
  record("caption non-empty", caption.length > 0, `caption length = ${caption.length} characters`);
  record(
    "caption contains play code",
    captionHasCode,
    captionHasCode ? `caption mentions "${post.play_code}"` : "caption does not mention the play code",
  );
  record(
    "caption contains referral link",
    captionHasLink,
    captionHasLink ? "caption mentions the referral link" : "caption does not mention the referral link",
  );
  record(
    "caption tags @makefunai",
    captionTagsMakefun,
    captionTagsMakefun ? "caption mentions @makefunai" : "caption does not mention @makefunai",
  );

  // 8. Meme image: valid PNG with the expected dimensions
  const png = readPng();
  record(
    "meme.png is a valid PNG",
    png.ok,
    png.ok ? `meme.png parsed, IHDR ${png.width}x${png.height}` : png.error,
  );
  if (png.ok) {
    const sizeOk = png.width === EXPECTED_WIDTH && png.height === EXPECTED_HEIGHT;
    record(
      "meme.png dimensions",
      sizeOk,
      `expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, found ${png.width}x${png.height}`,
    );
  }

  // Report
  console.log("make.fun entry check — gta6-meme-x-01 (GTA 6 meme on X)");
  console.log("========================================================");
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name} — ${r.detail}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log("--------------------------------------------------------");
  if (failed === 0) {
    console.log(`All ${results.length} checks passed. Entry is ready to submit.`);
  } else {
    console.log(`${failed} of ${results.length} checks failed. Fix the problems above and run again.`);
    process.exit(1);
  }
}

main();
