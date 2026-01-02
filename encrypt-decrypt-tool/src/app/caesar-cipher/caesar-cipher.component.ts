import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caesar-cipher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './caesar-cipher.component.html',
  styleUrl: './caesar-cipher.component.css'
})
export class CaesarCipherComponent {
  text: string = '';
  key: number = 3; // Default Caesar cipher key
  result: string = '';
  errorMessage: string | null = null;

  onTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filteredValue = inputElement.value.replace(/[^a-zA-Z]/g, '').toUpperCase(); // Ensure uppercase as per previous request
    this.text = filteredValue;
    inputElement.value = filteredValue; // Update the input element's value directly
    this.errorMessage = null; // Clear error message on input change
  }

  onKeyInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let keyValue = parseInt(inputElement.value, 10);

    if (isNaN(keyValue)) {
      this.key = 0;
      inputElement.value = '0';
    } else {
      keyValue = Math.max(0, Math.min(25, keyValue)); // Restrict between 0 and 25
      this.key = keyValue;
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
    this.result = this.caesarCipher(this.text, this.key, true);
  }

  decrypt(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.text) {
      this.errorMessage = 'Please enter text to decrypt.';
      return;
    }
    this.result = this.caesarCipher(this.text, this.key, false);
  }

  private caesarCipher(input: string, key: number, encrypt: boolean): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      // Only process alphabetic characters, non-alphabetic are ignored due to onTextInput filtering
      if (char >= 'A' && char <= 'Z') { // Now only handling uppercase due to onTextInput
        let offset = encrypt ? key : -key;
        char = String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + offset + 26) % 26) + 'A'.charCodeAt(0));
      }
      output += char;
    }
    return output;
  }
}
