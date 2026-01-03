# Encryption/Decryption Tool

This is an Angular-based web application providing an interactive tool for encrypting and decrypting messages using several classical ciphers. It also includes a specialized cracker for the Hill Cipher using a known plaintext attack.

## Features

*   **Caesar Cipher:** Simple substitution cipher with a shift key (0-25).
*   **Affine Cipher:** Monoalphabetic substitution cipher with a two-part key (a, b).
*   **Playfair Cipher:** Digraphic substitution cipher using a keyword to generate a 5x5 matrix.
*   **Hill Cipher (2x2 Matrix):** Polygraphic substitution cipher using a 2x2 matrix as a key. Includes a valid key generator.
*   **Hill Cracker (Known Plaintext Attack):** A tool to deduce the Hill Cipher's key matrix from known plaintext-ciphertext pairs. Includes a valid pair generator.
*   **User-Friendly Interface:** Clean, dark-themed UI with real-time input validation and animated result displays.

## Prerequisites

Before running this application, ensure you have the following installed on your system (Windows recommended for these instructions):

*   **Node.js and npm:**
    *   Download and install from [nodejs.org](https://nodejs.org/). `npm` (Node Package Manager) is included with Node.js.
*   **Angular CLI:**
    *   Install globally using npm:
        ```bash
        npm install -g @angular/cli
        ```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/s-rifat/Encryption-Decryption-Tool.git
    cd Encryption-Decryption-Tool
    ```
2.  **Navigate to the Angular project directory:**
    ```bash
    cd encrypt-decrypt-tool
    ```
3.  **Install npm dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To run the application in development mode:

1.  **Navigate to the Angular project directory** (if you're not already there):
    ```bash
    cd encrypt-decrypt-tool
    ```
2.  **Start the development server:**
    ```bash
    npm start
    ```
    This will compile the application and start a local server.
3.  **Open your browser** and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
