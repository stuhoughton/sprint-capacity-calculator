/**
 * Input validation utilities for Sprint Capacity Calculator
 * Provides validation functions for all user inputs with consistent error handling
 */

/**
 * Validation result returned by all validation functions
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates that a value is a non-negative number (for hours input)
 * Requirement 15.1: Non-negative numbers for time inputs
 *
 * @param value - The value to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateHours(value: any): ValidationResult {
  // Handle empty/null values - treat as zero (valid)
  if (value === '' || value === null || value === undefined) {
    return { isValid: true };
  }

  const num = parseFloat(value);

  // Check if it's a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      errorMessage: 'Must be a valid number',
    };
  }

  // Check if it's non-negative
  if (num < 0) {
    return {
      isValid: false,
      errorMessage: 'Hours cannot be negative',
    };
  }

  return { isValid: true };
}

/**
 * Validates that a value is a positive number (for base hours configuration)
 * Requirement 15.3: Positive numbers for configuration fields
 *
 * @param value - The value to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateBaseHours(value: any): ValidationResult {
  // Empty values are invalid for base hours (must be explicitly set)
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      errorMessage: 'Base hours is required',
    };
  }

  const num = parseFloat(value);

  // Check if it's a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      errorMessage: 'Base hours must be a valid number',
    };
  }

  // Check if it's positive (> 0)
  if (num <= 0) {
    return {
      isValid: false,
      errorMessage: 'Base hours must be a positive number',
    };
  }

  return { isValid: true };
}

/**
 * Validates that a value is a positive number (for story point scale values)
 * Requirement 15.3: Positive numbers for configuration fields
 *
 * @param value - The value to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateStoryPointValue(value: any): ValidationResult {
  // Empty values are invalid for story point values (must be explicitly set)
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      errorMessage: 'Story point value is required',
    };
  }

  const num = parseFloat(value);

  // Check if it's a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      errorMessage: 'Story point value must be a valid number',
    };
  }

  // Check if it's positive (> 0)
  if (num <= 0) {
    return {
      isValid: false,
      errorMessage: 'Story point value must be a positive number',
    };
  }

  return { isValid: true };
}

/**
 * Validates that a value is a non-empty string (for team member names)
 * Requirement 15.4: Non-empty strings for team member names
 *
 * @param value - The value to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateTeamMemberName(value: any): ValidationResult {
  // Check if it's a string
  if (typeof value !== 'string') {
    return {
      isValid: false,
      errorMessage: 'Team member name must be a string',
    };
  }

  // Check if it's non-empty after trimming whitespace
  if (value.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Team member name is required',
    };
  }

  return { isValid: true };
}
