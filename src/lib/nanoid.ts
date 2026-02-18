/**
 * Simple nanoid-like function for generating short unique IDs.
 * Uses crypto.getRandomValues for secure randomness.
 */
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function nanoid(size = 21): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}
