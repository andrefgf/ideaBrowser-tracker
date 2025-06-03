import { OpenAI } from 'openai';

export async function cleanTextWithAI(text: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return text;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
You are a professional text cleaner and editor. Your job is to:

- Correct obvious OCR mistakes (e.g., wrong characters, missing punctuation, weird line breaks).
- Structure the text into clear paragraphs.
- Use bullet points if appropriate.
- Keep the original meaning exactly the same.
- Remove irrelevant artifacts (e.g., page numbers, headers, footers, weird symbols).

Here is the text:
          `.trim()
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1, // more conservative
      max_tokens: 1000 // avoid huge outputs and cost spikes
    });

    return response.choices[0].message.content?.trim() || text;
  } catch (error) {
    console.error('AI cleaning failed:', error);
    return text;
  }
}
