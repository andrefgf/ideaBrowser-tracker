export function analyzeTextQuality(text: string) {
  const metrics = {
    length: text.length,
    lineCount: text.split('\n').length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    readabilityScore: 0,
    uniqueWords: new Set<string>(),
  };

  // Calculate readability (simple version)
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  
  if (sentences.length > 0 && words.length > 0) {
    const wordsPerSentence = words.length / sentences.length;
    const syllables = words.join('').length / words.length; // Approximation
    metrics.readabilityScore = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllables);
  }

  // Count unique words
  words.forEach(word => metrics.uniqueWords.add(word.toLowerCase()));

  return {
    ...metrics,
    uniqueWordCount: metrics.uniqueWords.size,
    uniqueWords: Array.from(metrics.uniqueWords).slice(0, 50) // First 50 unique words
  };
}