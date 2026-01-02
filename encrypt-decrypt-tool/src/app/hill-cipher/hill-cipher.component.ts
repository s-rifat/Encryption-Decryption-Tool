import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hill-cipher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hill-cipher.component.html',
  styleUrl: './hill-cipher.component.css'
})
export class HillCipherComponent {
  text: string = '';
  keyMatrix: number[][] = [[0, 0], [0, 0]]; // Initialize with dummy values
  result: string = '';
  errorMessage: string | null = null;

  private readonly ALPHABET_SIZE = 26;

  constructor() {
    this.generateValidKey(); // Generate a valid key on component initialization
  }

  onTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filteredValue = inputElement.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    this.text = filteredValue;
    inputElement.value = filteredValue;
    this.errorMessage = null; // Clear error message on input change
  }

  onKeyInput(row: number, col: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let keyValue = parseInt(inputElement.value, 10);

    if (isNaN(keyValue)) {
      this.keyMatrix[row][col] = 0;
      inputElement.value = '0';
    } else {
      keyValue = Math.max(0, Math.min(25, keyValue));
      this.keyMatrix[row][col] = keyValue;
      inputElement.value = keyValue.toString();
    }
    this.errorMessage = null; // Clear error message on input change
  }

  generateValidKey(): void {
    this.errorMessage = null; // Clear previous errors
    let det = 0;
    let detInverse = -1;
    let tempMatrix: number[][] = [[0,0],[0,0]];
  
    while (detInverse === -1) {
      for(let i=0; i<2; i++) {
        for(let j=0; j<2; j++) {
          tempMatrix[i][j] = Math.floor(Math.random() * 26);
        }
      }
      det = tempMatrix[0][0] * tempMatrix[1][1] - tempMatrix[0][1] * tempMatrix[1][0];
      const detMod26 = (det % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;
      detInverse = this.modInverse(detMod26, this.ALPHABET_SIZE);
    }
    this.keyMatrix = tempMatrix;
  }

  encrypt(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.text) {
      this.errorMessage = 'Please enter text to encrypt.';
      return;
    }
    try {
      this.result = this.hillCipher(this.text, this.keyMatrix, true);
    } catch (e: any) {
      this.errorMessage = e.message;
      this.result = ''; // Clear result if there's an error
    }
  }

  decrypt(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.text) {
      this.errorMessage = 'Please enter text to decrypt.';
      return;
    }
    try {
      this.result = this.hillCipher(this.text, this.keyMatrix, false);
    } catch (e: any) {
      this.errorMessage = e.message;
      this.result = ''; // Clear result if there's an error
    }
  }

  private hillCipher(inputText: string, key: number[][], encrypt: boolean): string {
    const processedText = this.preprocessText(inputText);
    if (processedText.length === 0) {
      throw new Error("No alphabetic characters to process.");
    }
    if (processedText.length % 2 !== 0) {
      throw new Error("Plaintext length must be even for 2x2 Hill Cipher. Please ensure input can be paired.");
    }

    let output = '';
    const matrixSize = 2; // Fixed for 2x2 matrix

    let actualKey = key;
    if (!encrypt) {
      actualKey = this.getInverseMatrix(key);
    }

    for (let i = 0; i < processedText.length; i += matrixSize) {
      const char1 = processedText[i];
      const char2 = processedText[i + 1];

      const p1 = char1.charCodeAt(0) - 'A'.charCodeAt(0);
      const p2 = char2.charCodeAt(0) - 'A'.charCodeAt(0);

      let c1 = (actualKey[0][0] * p1 + actualKey[0][1] * p2) % this.ALPHABET_SIZE;
      let c2 = (actualKey[1][0] * p1 + actualKey[1][1] * p2) % this.ALPHABET_SIZE;

      // Ensure positive results for modulo
      c1 = (c1 + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;
      c2 = (c2 + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;

      output += String.fromCharCode(c1 + 'A'.charCodeAt(0));
      output += String.fromCharCode(c2 + 'A'.charCodeAt(0));
    }
    return output;
  }

  private preprocessText(text: string): string {
    return text.toUpperCase().replace(/[^A-Z]/g, '');
  }

  private getInverseMatrix(key: number[][]): number[][] {
    const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]);
    const detMod26 = (det % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;

    const detInverse = this.modInverse(detMod26, this.ALPHABET_SIZE);
    if (detInverse === -1) {
      throw new Error(`Determinant inverse does not exist. Determinant mod 26 is ${detMod26}. Key matrix is not invertible.`);
    }

    const adjugateMatrix = [
      [key[1][1], -key[0][1]],
      [-key[1][0], key[0][0]]
    ];

    const inverseMatrix: number[][] = [];
    for (let i = 0; i < 2; i++) {
      inverseMatrix.push([]);
      for (let j = 0; j < 2; j++) {
        inverseMatrix[i].push((adjugateMatrix[i][j] * detInverse) % this.ALPHABET_SIZE);
        inverseMatrix[i][j] = (inverseMatrix[i][j] + this.ALPHABET_SIZE) % this.ALPHABET_SIZE; // Ensure positive
      }
    }
    return inverseMatrix;
  }

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
