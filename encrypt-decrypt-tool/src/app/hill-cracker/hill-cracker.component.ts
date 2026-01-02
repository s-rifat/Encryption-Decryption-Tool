import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hill-cracker',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hill-cracker.component.html',
  styleUrl: './hill-cracker.component.css'
})
export class HillCrackerComponent {
  plaintext: string = '';
  ciphertext: string = '';
  keyMatrixResult: number[][] | null = null;
  errorMessage: string | null = null; // Renamed from 'error'

  private readonly ALPHABET_SIZE = 26;

  onTextInput(event: Event, type: 'plaintext' | 'ciphertext'): void {
    const inputElement = event.target as HTMLInputElement;
    const filteredValue = inputElement.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (type === 'plaintext') {
      this.plaintext = filteredValue;
    } else {
      this.ciphertext = filteredValue;
    }
    inputElement.value = filteredValue;
    this.errorMessage = null; // Clear error message on input change
    this.keyMatrixResult = null; // Clear key result as well
  }

  generateValidPair(): void {
    this.errorMessage = null; // Clear previous errors
    this.keyMatrixResult = null; // Clear previous results
    let validPMatrixFound = false;
    let P_matrix: number[][] = [[0,0],[0,0]];
    let K_matrix: number[][] = [[0,0],[0,0]];

    // 1. Generate a random, valid (invertible) 2x2 key matrix K
    let detKInverse = -1;
    while(detKInverse === -1){
      for(let i=0; i<2; i++) {
        for(let j=0; j<2; j++) {
          K_matrix[i][j] = Math.floor(Math.random() * this.ALPHABET_SIZE);
        }
      }
      const detK = K_matrix[0][0] * K_matrix[1][1] - K_matrix[0][1] * K_matrix[1][0];
      const detKMod26 = (detK % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;
      detKInverse = this.modInverse(detKMod26, this.ALPHABET_SIZE);
    }

    // 2. Generate a random, valid (invertible) 2x2 plaintext matrix P
    while(!validPMatrixFound){
      for(let i=0; i<2; i++) {
        for(let j=0; j<2; j++) {
          P_matrix[i][j] = Math.floor(Math.random() * this.ALPHABET_SIZE);
        }
      }
      const detP = P_matrix[0][0] * P_matrix[1][1] - P_matrix[0][1] * P_matrix[1][0];
      const detPMod26 = (detP % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;
      if(this.modInverse(detPMod26, this.ALPHABET_SIZE) !== -1){
        validPMatrixFound = true;
      }
    }

    // 3. Calculate the ciphertext matrix C = PK mod 26
    const C_matrix = this.matrixMultiply(P_matrix, K_matrix);

    // 4. Convert P and C matrices to 4-letter strings and populate fields
    this.plaintext = this.numbersToText([P_matrix[0][0], P_matrix[0][1], P_matrix[1][0], P_matrix[1][1]]);
    this.ciphertext = this.numbersToText([C_matrix[0][0], C_matrix[0][1], C_matrix[1][0], C_matrix[1][1]]);
  }

  crackKey(): void {
    this.keyMatrixResult = null;
    this.errorMessage = null; // Clear previous errors

    if (this.plaintext.length !== 4 || this.ciphertext.length !== 4) {
      this.errorMessage = 'Plaintext and Ciphertext must both be 4 letters long.';
      return;
    }

    try {
      const P_flat = this.textToNumbers(this.plaintext);
      const C_flat = this.textToNumbers(this.ciphertext);

      const P_matrix: number[][] = [[P_flat[0], P_flat[1]], [P_flat[2], P_flat[3]]];
      const C_matrix: number[][] = [[C_flat[0], C_flat[1]], [C_flat[2], C_flat[3]]];
      
      const P_inverse = this.getMatrixInverse(P_matrix);
      const K = this.matrixMultiply(P_inverse, C_matrix);
      this.keyMatrixResult = K;
    } catch (e: any) {
      this.errorMessage = e.message;
    }
  }

  private textToNumbers(text: string): number[] {
    const numbers: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text[i].toUpperCase().charCodeAt(0);
      if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
        numbers.push(charCode - 'A'.charCodeAt(0));
      } else {
        throw new Error('Input must contain only alphabetic characters.');
      }
    }
    return numbers;
  }

  private numbersToText(numbers: number[]): string {
    let text = '';
    for (const num of numbers) {
      text += String.fromCharCode(num + 'A'.charCodeAt(0));
    }
    return text;
  }

  private getMatrixInverse(matrix: number[][]): number[][] {
    const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]);
    const detMod26 = (det % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;

    const detInverse = this.modInverse(detMod26, this.ALPHABET_SIZE);
    if (detInverse === -1) {
      throw new Error(`Determinant of plaintext matrix is ${detMod26}. Inverse does not exist. Cannot crack key.`);
    }

    const adjugateMatrix = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]]
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

  private matrixMultiply(matrixA: number[][], matrixB: number[][]): number[][] {
    const resultMatrix: number[][] = [[0, 0], [0, 0]];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let sum = 0;
        for (let k = 0; k < 2; k++) {
          sum += matrixA[i][k] * matrixB[k][j];
        }
        resultMatrix[i][j] = (sum % this.ALPHABET_SIZE + this.ALPHABET_SIZE) % this.ALPHABET_SIZE;
      }
    }
    return resultMatrix;
  }

  private modInverse(a: number, m: number): number {
    for (let x = 1; x < m; x++) {
      if (((a * x) % m) === 1) {
        return x;
      }
    }
    return -1; // Inverse doesn't exist
  }
}
