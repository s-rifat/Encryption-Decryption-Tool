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
  errorMessage: string | null = null;

  // Possible values for alpha where gcd(alpha, 26) = 1
  possibleAlphaKeys: number[] = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  constructor() {
    this.alphaKey = this.possibleAlphaKeys[0]; // Set default to the first valid key
  }

  onTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filteredValue = inputElement.value.replace(/[^a-zA-Z]/g, '').toUpperCase(); // Ensure uppercase
    this.text = filteredValue;
    inputElement.value = filteredValue; // Update the input element's value directly
    this.errorMessage = null; // Clear error message on input change
  }

  onBetaKeyInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let keyValue = parseInt(inputElement.value, 10);

    if (isNaN(keyValue)) {
      this.betaKey = 0;
      inputElement.value = '0';
    } else {
      keyValue = Math.max(0, Math.min(25, keyValue)); // Restrict between 0 and 25
      this.betaKey = keyValue;
      inputElement.value = keyValue.toString(); // Update input element's value
    }
    this.errorMessage = null; // Clear error message on input change
  }

  encrypt(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.text) {
      this.errorMessage = 'Please enter text to encrypt.';
      return;
    }
    this.result = this.affineCipher(this.text, this.alphaKey, this.betaKey, true);
    if (this.result.startsWith('Error:')) {
        this.errorMessage = this.result;
        this.result = ''; // Clear result if there's an error
    }
  }

  decrypt(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.text) {
      this.errorMessage = 'Please enter text to decrypt.';
      return;
    }
    this.result = this.affineCipher(this.text, this.alphaKey, this.betaKey, false);
    if (this.result.startsWith('Error:')) {
        this.errorMessage = this.result;
        this.result = ''; // Clear result if there's an error
    }
  }

  private affineCipher(input: string, alpha: number, beta: number, encrypt: boolean): string {
    let output = '';
    const m = 26; // Modulo for English alphabet

    // Check if alpha is valid for decryption
    if (!encrypt && this.gcd(alpha, m) !== 1) {
      return 'Error: Alpha key is not valid for decryption. gcd(alpha, 26) must be 1.';
    }

    let alphaInverse = -1;
    if (!encrypt) {
      alphaInverse = this.modInverse(alpha, m);
      if (alphaInverse === -1) {
        return 'Error: Modular inverse for alpha key not found. Alpha key might be invalid.';
      }
    }

    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      let charCode = char.charCodeAt(0);

      // Only process alphabetic characters, non-alphabetic are ignored due to onTextInput filtering
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
      // Assuming all input is uppercase after onTextInput, so no else if for lowercase
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

  // Function to find modular multiplicative inverse
  private modInverse(a: number, m: number): number {
    for (let x = 1; x < m; x++) {
      if (((a * x) % m) === 1) {
        return x;
      }
    }
    return -1; // Inverse doesn't exist
  }
}
