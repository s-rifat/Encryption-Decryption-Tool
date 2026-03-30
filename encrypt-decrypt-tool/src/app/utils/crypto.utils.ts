// src/app/utils/crypto.utils.ts

/**
 * Calculates the modular multiplicative inverse of a number 'a' modulo 'm'.
 * This is a number 'x' such that (a * x) % m = 1.
 * @param a The number to find the inverse of.
 * @param m The modulus.
 * @returns The modular inverse, or -1 if it does not exist.
 */
export function modInverse(a: number, m: number): number {
  a = (a % m + m) % m; // Ensure 'a' is positive
  for (let x = 1; x < m; x++) {
    if (((a * x) % m) === 1) {
      return x;
    }
  }
  return -1; // Inverse doesn't exist
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The greatest common divisor.
 */
export function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
