export function extractNumber(text) {
  if (!text) {
    throw new Error('Input text is empty or undefined');
  }

  const number = parseFloat(text);

  if (isNaN(number)) {
    throw new Error(`Failed to parse price value from: "${text}"`);
  }

  return number;
}

export function formatPrice(price) {
  return price.toFixed(4);
}