// src/app/utils/input.utils.ts

/**
 * Filters an input event's value to allow only alphabetic characters,
 * converts them to uppercase, and updates the input element's value.
 * @param event The input event from the text field.
 * @returns The filtered and uppercased string value.
 */
export function filterAlphabeticInput(event: Event): string {
  const inputElement = event.target as HTMLInputElement;
  const filteredValue = inputElement.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
  inputElement.value = filteredValue;
  return filteredValue;
}
