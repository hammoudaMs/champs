import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "/opt/cursor/artifacts";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto("http://localhost:3000/comptoir", { waitUntil: "networkidle" });
await page.locator('input[inputmode="numeric"]').fill("2580");
await page.getByRole("button", { name: /entrer|enter|دخل/i }).click();
await page.waitForURL("**/comptoir**");
await page.waitForTimeout(800);

await page.getByRole("tab", { name: /stock|ستوك/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/comptoir-stock.png`, fullPage: true });

await page.getByRole("button", { name: /scanner|scan|سكان/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/comptoir-scan.png`, fullPage: true });

await page.getByRole("tab", { name: /caisse|cash|صندوق/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/comptoir-caisse.png`, fullPage: true });

await browser.close();
console.log("saved screenshots");
