import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playfair-cipher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './playfair-cipher.component.html',
  styleUrl: './playfair-cipher.component.css'
})
export class PlayfairCipherComponent {
  text: string = '';
  keyword: string = '';
  result: string = '';
  private matrix: string[][] = [];

  encrypt(): void {
    if (!this.keyword) {
      this.result = 'Error: Please enter a keyword.';
      return;
    }
    this.generateMatrix(this.keyword);
    let processedText = this.preprocessText(this.text, true);
    this.result = this.playfair(processedText, true);
  }

  decrypt(): void {
    if (!this.keyword) {
      this.result = 'Error: Please enter a keyword.';
      return;
    }
    this.generateMatrix(this.keyword);
    let processedText = this.preprocessText(this.text, false); // Decryption input needs less preprocessing
    this.result = this.playfair(processedText, false);
  }

  private generateMatrix(keyword: string): void {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted
    let keySquare = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let seen = new Set<string>();
    let effectiveKey = '';

    for (const char of keySquare) {
      if (!seen.has(char)) {
        effectiveKey += char;
        seen.add(char);
      }
    }

    for (const char of alphabet) {
      if (!seen.has(char)) {
        effectiveKey += char;
        seen.add(char);
      }
    }

    this.matrix = [];
    for (let i = 0; i < 5; i++) {
      this.matrix.push([]);
      for (let j = 0; j < 5; j++) {
        this.matrix[i].push(effectiveKey[i * 5 + j]);
      }
    }
  }

  private preprocessText(text: string, isEncryption: boolean): string {
    let processed = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let result = '';

    if (isEncryption) {
      for (let i = 0; i < processed.length; i += 2) {
        if (i + 1 === processed.length) {
          result += processed[i] + 'X';
        } else {
          let char1 = processed[i];
          let char2 = processed[i + 1];
          if (char1 === char2) {
            result += char1 + 'X';
            i--; // Re-process the second character with a new pair
          } else {
            result += char1 + char2;
          }
        }
      }
    } else { // For decryption, we expect digrams and don't add fillers
      result = processed;
    }

    // Ensure even length for encryption, add 'X' if odd
    if (isEncryption && result.length % 2 !== 0) {
      result += 'X';
    }
    return result;
  }

  private findCharPosition(char: string): { row: number, col: number } | null {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (this.matrix[row][col] === char) {
          return { row, col };
        }
      }
    }
    return null; // Should not happen with valid input
  }

  private playfair(text: string, isEncrypt: boolean): string {
    let output = '';
    for (let i = 0; i < text.length; i += 2) {
      let char1 = text[i];
      let char2 = text[i + 1];

      let pos1 = this.findCharPosition(char1);
      let pos2 = this.findCharPosition(char2);

      if (!pos1 || !pos2) {
        // Handle error or skip character
        output += char1 + char2;
        continue;
      }

      let newChar1: string;
      let newChar2: string;

      if (pos1.row === pos2.row) {
        // Same row
        newChar1 = this.matrix[pos1.row][(pos1.col + (isEncrypt ? 1 : 4)) % 5];
        newChar2 = this.matrix[pos2.row][(pos2.col + (isEncrypt ? 1 : 4)) % 5];
      } else if (pos1.col === pos2.col) {
        // Same column
        newChar1 = this.matrix[(pos1.row + (isEncrypt ? 1 : 4)) % 5][pos1.col];
        newChar2 = this.matrix[(pos2.row + (isEncrypt ? 1 : 4)) % 5][pos2.col];
      } else {
        // Different row and column
        newChar1 = this.matrix[pos1.row][pos2.col];
        newChar2 = this.matrix[pos2.row][pos1.col];
      }
      output += newChar1 + newChar2;
    }
    return output;
  }
}
