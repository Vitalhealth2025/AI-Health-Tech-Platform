// Strips characters used for HTML injection and prompt injection
export function sanitizeText(value: string): string {
  return value
    .replace(/[<>"`;\\]/g, '')
    .replace(/\$\{[^}]*\}/g, '')
    .trim();
}

// For names: only letters (including accented), spaces, hyphens, apostrophes
export function validateName(value: string, fieldName: string): string | null {
  const cleaned = value.trim();
  if (!cleaned) return `${fieldName} is required.`;
  if (cleaned.length < 2) return `${fieldName} must be at least 2 characters.`;
  if (cleaned.length > 50) return `${fieldName} must be 50 characters or fewer.`;
  if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(cleaned)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes.`;
  }
  return null;
}

// For food names: letters, numbers, spaces, and common food punctuation
export function validateFoodName(value: string): string | null {
  const cleaned = value.trim();
  if (!cleaned) return 'Food name is required.';
  if (cleaned.length > 100) return 'Food name must be 100 characters or fewer.';
  if (!/^[a-zA-Z0-9\s\-,.()'&/]+$/.test(cleaned)) {
    return 'Food name contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed.';
  }
  return null;
}

// For numeric fields with a valid range
export function validateNumber(
  value: string | number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  const num = Number(value);
  if (value === '' || isNaN(num)) return `${fieldName} must be a number.`;
  if (num < min) return `${fieldName} must be at least ${min}.`;
  if (num > max) return `${fieldName} must be no more than ${max}.`;
  return null;
}

// Sanitizes a value before embedding in an AI prompt
export function sanitizeForPrompt(value: unknown): string {
  return String(value ?? '')
    .replace(/[<>"`;\\]/g, '')
    .replace(/\$\{[^}]*\}/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);
}
