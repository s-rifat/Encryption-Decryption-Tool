import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-caesar-cipher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './caesar-cipher.component.html',
  styleUrl: './caesar-cipher.component.css'
})
export class CaesarCipherComponent {
  text: string = '';
  key: number = 3; // Default Caesar cipher key
  result: string = '';

  encrypt(): void {
    this.result = this.caesarCipher(this.text, this.key, true);
  }

  decrypt(): void {
    this.result = this.caesarCipher(this.text, this.key, false);
  }

  private caesarCipher(input: string, key: number, encrypt: boolean): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      if (char >= 'a' && char <= 'z') {
        let offset = encrypt ? key : -key;
        char = String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) + offset + 26) % 26) + 'a'.charCodeAt(0));
      } else if (char >= 'A' && char <= 'Z') {
        let offset = encrypt ? key : -key;
        char = String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + offset + 26) % 26) + 'A'.charCodeAt(0));
      }
      output += char;
    }
    return output;
  }
}
