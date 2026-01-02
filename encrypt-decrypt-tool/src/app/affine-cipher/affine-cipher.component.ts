import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-affine-cipher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './affine-cipher.component.html',
  styleUrl: './affine-cipher.component.css'
})
export class AffineCipherComponent {
  text: string = '';
  alphaKey: number = 1; // Default alpha key
  betaKey: number = 0;  // Default beta key
  result: string = '';

  // Possible values for alpha where gcd(alpha, 26) = 1
  possibleAlphaKeys: number[] = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  constructor() {
    this.alphaKey = this.possibleAlphaKeys[0]; // Set default to the first valid key
  }

  encrypt(): void {
    this.result = this.affineCipher(this.text, this.alphaKey, this.betaKey, true);
  }

  decrypt(): void {
    this.result = this.affineCipher(this.text, this.alphaKey, this.betaKey, false);
  }

  private affineCipher(input: string, alpha: number, beta: number, encrypt: boolean): string {
    let output = '';
    const m = 26; // Modulo for English alphabet

    // Check if alpha is valid for decryption
    if (!encrypt && this.gcd(alpha, m) !== 1) {
      this.result = 'Error: Alpha key is not valid for decryption. gcd(alpha, 26) must be 1.';
      return '';
    }

    let alphaInverse = -1;
    if (!encrypt) {
      alphaInverse = this.modInverse(alpha, m);
      if (alphaInverse === -1) {
        this.result = 'Error: Modular inverse for alpha key not found. Alpha key might be invalid.';
        return '';
      }
    }

    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      let charCode = char.charCodeAt(0);

      // Handle uppercase letters
      if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
        let x = charCode - 'A'.charCodeAt(0);
        let transformedX: number;
        if (encrypt) {
          transformedX = (alpha * x + beta) % m;
        } else {
          transformedX = (alphaInverse * (x - beta + m)) % m; // Add m to handle negative results before modulo
        }
        output += String.fromCharCode(transformedX + 'A'.charCodeAt(0));
      }
      // Handle lowercase letters
      else if (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) {
        let x = charCode - 'a'.charCodeAt(0);
        let transformedX: number;
        if (encrypt) {
          transformedX = (alpha * x + beta) % m;
        } else {
          transformedX = (alphaInverse * (x - beta + m)) % m;
        }
        output += String.fromCharCode(transformedX + 'a'.charCodeAt(0));
      }
      // Keep non-alphabetic characters as they are
      else {
        output += char;
      }
    }
    return output;
  }

  // Function to calculate GCD
  private gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  // Function to find modular multiplicative inverse using extended Euclidean algorithm
  private modInverse(a: number, m: number): number {
    for (let x = 1; x < m; x++) {
      if (((a % m) * (x % m)) % m === 1) {
        return x;
      }
    }
    return -1; // Inverse doesn't exist
  }
}
