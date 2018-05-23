// Create synchronous validators which check that the Tracking Number field:

// Must contain a value
export const required = (value) =>
  !value ? 'Field must not be blank' : undefined;

// The value is non-empty
export const checkEmpty = (value) =>
  value.trim() === '' ? 'Field must not be empty' : undefined;

// The value is be exactly 5 characters long
export const checkLength = (value) =>
  value.length !== 5 ? 'Field must be 5 characters long' : undefined;

// Each character is a number
export const isNum = (value) => 
  value % 1 !== 0 ? 'Field must be a number' : undefined;