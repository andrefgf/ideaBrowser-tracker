export function analyzeTextQuality(text: string) {
  if (!text || text.trim().length === 0) {
    return {
      uniqueWordCount: 0,
      uniqueWords: [],
      length: 0,
      lineCount: 0,
      wordCount: 0,
      readabilityScore: 0,
    };
  }

  // Basic metrics
  const length = text.length;
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  const uniqueWords = [...new Set(words.map(word => word.toLowerCase()))];
  const uniqueWordCount = uniqueWords.length;
  const lineCount = (text.match(/\n/g) || []).length + 1;

  // Enhanced readability score calculation
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  const uniqueWordRatio = uniqueWordCount / wordCount;
  
  // Calculate readability score (0-10 scale)
  let readabilityScore = Math.min(10, 
    (uniqueWordRatio * 5) + // Vocabulary diversity
    (Math.min(avgWordLength, 8) / 8 * 3) + // Word complexity
    (Math.min(wordCount, 200) / 200 * 2)   // Content volume
  );

  // Round to 1 decimal place
  readabilityScore = Math.round(readabilityScore * 10) / 10;

  return {
    uniqueWordCount,
    uniqueWords,
    length,
    lineCount,
    wordCount,
    readabilityScore,
  };
}