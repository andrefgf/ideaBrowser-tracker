import Tesseract from 'tesseract.js';

export async function extractTextFromImageBuffer(buffer: Buffer): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
  return text;
}
