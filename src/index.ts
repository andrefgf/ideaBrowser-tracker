import { chromium } from 'playwright';
import { extractTextFromImageBuffer } from './ocr';
import { storeSnapshot } from './db';
import { TARGET_URL } from './utils/constants';
import { analyzeTextQuality } from './utils/textAnalysis';
import { cleanTextWithAI } from './utils/textCleaning';
import 'dotenv/config';

// Extract visible text directly from the page
async function extractPageText(page: any): Promise<string> {
  try {
    const directText = await page.locator('body').innerText();
    return directText;
  } catch (error) {
    console.error('Error extracting direct text:', error);
    return '';
  }
}

async function captureIdeaBrowser() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to target URL
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Capture screenshot directly to buffer
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  console.log('Screenshot captured in memory.');

  // Parallel extraction: direct text + OCR (now using buffer input)
  const [directText, ocrText] = await Promise.all([
    extractPageText(page),
    extractTextFromImageBuffer(screenshotBuffer)
  ]);

  // Combine both, prioritizing direct text
  const combinedText = directText || ocrText;

  // Text quality analysis
  const directAnalysis = analyzeTextQuality(directText);
  const ocrAnalysis = analyzeTextQuality(ocrText);

  // Calculate similarity score
  let similarityScore = 0;
  if (directText && ocrText) {
    const minLen = Math.min(directText.length, ocrText.length);
    let commonChars = 0;
    for (let i = 0; i < minLen; i++) {
      if (directText[i] === ocrText[i]) commonChars++;
    }
    similarityScore = commonChars / Math.max(directText.length, ocrText.length);
  }

  // Optional: AI text cleaning
  const cleanedText = await cleanTextWithAI(combinedText);

  // Store final snapshot in DB (store cleaned text and screenshot buffer)
  await storeSnapshot({
    url: TARGET_URL,
    content: cleanedText,
    screenshot_data: screenshotBuffer
  });

  console.log('\n===== FINAL SUMMARY =====');
  console.log(`Direct text length: ${directText.length} characters`);
  console.log(`OCR text length: ${ocrText.length} characters`);
  console.log(`Combined text length: ${combinedText.length} characters`);
  console.log(`Cleaned text length: ${cleanedText.length} characters`);
  console.log(`Similarity: ${(similarityScore * 100).toFixed(1)}%`);
  console.log(`\nSnapshot captured and stored in Supabase for: ${TARGET_URL}`);

  await browser.close();
}

captureIdeaBrowser().catch(console.error);
