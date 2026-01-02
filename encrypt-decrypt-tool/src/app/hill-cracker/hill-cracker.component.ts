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
  error: string | null = null;

  private readonly ALPHABET_SIZE = 26;

  crackKey(): void {
    this.keyMatrixResult = null;
    this.error = null;

    if (this.plaintext.length !== 4 || this.ciphertext.length !== 4) {
      this.error = 'Plaintext and Ciphertext must both be 4 letters long.';
      return;
    }

    const P_flat = this.textToNumbers(this.plaintext);
    const C_flat = this.textToNumbers(this.ciphertext);

    const P_matrix: number[][] = [[P_flat[0], P_flat[1]], [P_flat[2], P_flat[3]]];
    const C_matrix: number[][] = [[C_flat[0], C_flat[1]], [C_flat[2], C_flat[3]]];

    try {
      const P_inverse = this.getMatrixInverse(P_matrix);
      const K = this.matrixMultiply(P_inverse, C_matrix);
      this.keyMatrixResult = K;
    } catch (e: any) {
      this.error = e.message;
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
