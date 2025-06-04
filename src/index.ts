import { chromium } from 'playwright';
import { storeSnapshot, testSupabaseConnection } from './db'; // Added test function
import { TARGET_URL } from './utils/constants';
import { analyzeTextQuality } from './utils/textAnalysis';
import { cleanTextWithAI } from './utils/textCleaning';
import 'dotenv/config';

async function extractPageText(page: any): Promise<string> {
  try {
    const contentSelector = '.main-content, main, .content, .article, .post, body';
    const contentElement = page.locator(contentSelector).first();
    
    if (await contentElement.count() > 0) {
      return await contentElement.innerText();
    }
    return await page.locator('body').innerText();
  } catch (error) {
    console.error('Error extracting direct text:', error);
    return '';
  }
}

async function captureIdeaBrowser() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test database connection first
    await testSupabaseConnection();
    
    await page.goto(TARGET_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 // Increased timeout
    });

    const pageText = await extractPageText(page);
    console.log(`Extracted ${pageText.length} characters of text.`);

    // Handle empty content case
    if (!pageText || pageText.trim().length === 0) {
      throw new Error('No text content extracted from page');
    }

    const textAnalysis = analyzeTextQuality(pageText);
    console.log(`Text quality score: ${textAnalysis.readabilityScore.toFixed(1)}/10`);
    console.log(`Unique words: ${textAnalysis.uniqueWordCount}`);

    const cleanedText = await cleanTextWithAI(pageText);
    console.log(`Cleaned text length: ${cleanedText.length} characters`);

    // Store with proper field names
    const storageResult = await storeSnapshot({
      source_url: TARGET_URL,
      content: cleanedText,
      captured_at: new Date().toISOString()
    });

    if (!storageResult) {
      console.error('Failed to store snapshot in database');
    } else {
      console.log(`\nSnapshot captured and stored for: ${TARGET_URL}`);
    }
  } catch (error) {
    console.error('Error during capture process:', error);
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
}

// Add top-level error handling
captureIdeaBrowser()
  .then(() => console.log('Capture process completed'))
  .catch(error => console.error('Unhandled error in capture process:', error));