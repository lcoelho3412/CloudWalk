export function randomCreditLimit(emotionType: string, intensity: number) {
  const isPositiveEmotion = emotionType === 'positive';
  const baseLimit = isPositiveEmotion ? 500 : 100;
  
  const creditLimit = baseLimit + Math.random() * intensity * 10;

  return {
    credit_limit: creditLimit.toFixed(2),
  };
}
