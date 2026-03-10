/// <reference types="vitest" />
/**
 * Unit tests for validation utilities
 * Tests all validation functions with valid/invalid inputs and edge cases
 */

import {
  validateHours,
  validateBaseHours,
  validateStoryPointValue,
  validateTeamMemberName,
  ValidationResult,
} from './validation';
import { describe, it, expect } from 'vitest';

describe('validateHours', () => {
  it('should accept valid hours (zero, positive, decimal)', () => {
    expect(validateHours(0).isValid).toBe(true);
    expect(validateHours(8).isValid).toBe(true);
    expect(validateHours(1.5).isValid).toBe(true);
    expect(validateHours('4.5').isValid).toBe(true);
  });

  it('should treat empty/null/undefined as valid (zero)', () => {
    expect(validateHours('').isValid).toBe(true);
    expect(validateHours(null).isValid).toBe(true);
    expect(validateHours(undefined).isValid).toBe(true);
  });

  it('should reject negative numbers and invalid inputs', () => {
    expect(validateHours(-1).isValid).toBe(false);
    expect(validateHours('abc').isValid).toBe(false);
    expect(validateHours(NaN).isValid).toBe(false);
  });
});

describe('validateBaseHours', () => {
  it('should accept positive numbers', () => {
    expect(validateBaseHours(72).isValid).toBe(true);
    expect(validateBaseHours(72.34).isValid).toBe(true);
    expect(validateBaseHours('72.34').isValid).toBe(true);
  });

  it('should reject zero, negative, empty, null, undefined', () => {
    expect(validateBaseHours(0).isValid).toBe(false);
    expect(validateBaseHours(-72).isValid).toBe(false);
    expect(validateBaseHours('').isValid).toBe(false);
    expect(validateBaseHours(null).isValid).toBe(false);
    expect(validateBaseHours(undefined).isValid).toBe(false);
  });

  it('should reject non-numeric strings', () => {
    expect(validateBaseHours('abc').isValid).toBe(false);
    expect(validateBaseHours(NaN).isValid).toBe(false);
  });
});

describe('validateStoryPointValue', () => {
  it('should accept positive numbers', () => {
    expect(validateStoryPointValue(1).isValid).toBe(true);
    expect(validateStoryPointValue(4.5).isValid).toBe(true);
    expect(validateStoryPointValue('8').isValid).toBe(true);
  });

  it('should reject zero, negative, empty, null, undefined', () => {
    expect(validateStoryPointValue(0).isValid).toBe(false);
    expect(validateStoryPointValue(-5).isValid).toBe(false);
    expect(validateStoryPointValue('').isValid).toBe(false);
    expect(validateStoryPointValue(null).isValid).toBe(false);
    expect(validateStoryPointValue(undefined).isValid).toBe(false);
  });

  it('should reject non-numeric strings and NaN', () => {
    expect(validateStoryPointValue('abc').isValid).toBe(false);
    expect(validateStoryPointValue(NaN).isValid).toBe(false);
  });
});

describe('validateTeamMemberName', () => {
  it('should accept valid names', () => {
    expect(validateTeamMemberName('Alice').isValid).toBe(true);
    expect(validateTeamMemberName('Alice Johnson').isValid).toBe(true);
    expect(validateTeamMemberName("O'Brien-Smith").isValid).toBe(true);
  });

  it('should reject empty, whitespace-only, null, undefined', () => {
    expect(validateTeamMemberName('').isValid).toBe(false);
    expect(validateTeamMemberName('   ').isValid).toBe(false);
    expect(validateTeamMemberName(null).isValid).toBe(false);
    expect(validateTeamMemberName(undefined).isValid).toBe(false);
  });

  it('should reject non-string types', () => {
    expect(validateTeamMemberName(123).isValid).toBe(false);
    expect(validateTeamMemberName({}).isValid).toBe(false);
    expect(validateTeamMemberName([]).isValid).toBe(false);
  });
});

describe('ValidationResult interface', () => {
  it('should have isValid property', () => {
    const result: ValidationResult = { isValid: true };
    expect(result.isValid).toBe(true);
  });

  it('should have optional errorMessage property', () => {
    const result: ValidationResult = {
      isValid: false,
      errorMessage: 'Test error',
    };
    expect(result.errorMessage).toBe('Test error');
  });

  it('should allow errorMessage to be undefined', () => {
    const result: ValidationResult = { isValid: true };
    expect(result.errorMessage).toBeUndefined();
  });
});
