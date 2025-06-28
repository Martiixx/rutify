/**
 * Rutify - Chilean RUT (Rol Único Tributario) formatting and validation library
 */

export interface RutifyOptions {
  /** Character to use as thousand separator */
  separator?: string;
  /** Whether to use strict validation mode */
  strict?: boolean;
  /** Whether to normalize input before processing */
  normalize?: boolean;
  /** Output format: 'standard', 'compact', 'clean' */
  format?: 'standard' | 'compact' | 'clean';
}

export interface RutifyResult {
  /** The formatted RUT string or false if invalid */
  formatted: string | false;
  /** Whether the RUT is valid */
  isValid: boolean;
  /** Error message if any */
  error: string | null;
  /** The RUT body (digits only) */
  body: string | null;
  /** The check digit */
  checkDigit: string | null;
}

export class RutifyError extends Error {
  code: string;
  details: Record<string, any>;
  constructor(message: string, code: string, details?: Record<string, any>);
}

export class RutifyValidationError extends RutifyError {
  constructor(message: string, details?: Record<string, any>);
}

export class RutifyFormatError extends RutifyError {
  constructor(message: string, details?: Record<string, any>);
}

export const DEFAULT_OPTIONS: RutifyOptions;

/**
 * Formats a Chilean RUT string to the standard format XX.XXX.XXX-X
 * @param str - The RUT string to format
 * @param options - Formatting options
 * @returns The formatted RUT string or false if invalid
 */
export function rutify(str: string, options?: RutifyOptions): string | false;

/**
 * Validates a Chilean RUT using the official validation algorithm
 * @param str - The RUT string to validate
 * @param options - Validation options
 * @returns True if the RUT is valid, false otherwise
 */
export function validateRut(str: string, options?: RutifyOptions): boolean;

/**
 * Formats and validates a RUT in a single operation
 * @param str - The RUT string to process
 * @param options - Processing options
 * @returns Object containing formatted RUT, validation status, and any errors
 */
export function rutifyAndValidate(str: string, options?: RutifyOptions): RutifyResult;

/**
 * Extracts the body (digits) from a RUT string
 * @param str - The RUT string
 * @param options - Processing options
 * @returns The RUT body or false if invalid
 */
export function extractBody(str: string, options?: RutifyOptions): string | false;

/**
 * Extracts the check digit from a RUT string
 * @param str - The RUT string
 * @param options - Processing options
 * @returns The check digit or false if invalid
 */
export function extractCheckDigit(str: string, options?: RutifyOptions): string | false;

/**
 * Generates a check digit for a RUT body
 * @param body - The RUT body (digits only)
 * @returns The calculated check digit or false if invalid
 */
export function generateCheckDigit(body: string): string | false;

/**
 * Normalizes a RUT string (remove all formatting)
 * @param str - The RUT string to normalize
 * @returns The normalized RUT string or false if invalid
 */
export function normalize(str: string): string | false;

/**
 * Checks if a RUT is in a specific format
 * @param str - The RUT string to check
 * @param format - The format to check against ('standard', 'compact', 'clean')
 * @returns True if the RUT matches the specified format
 */
export function isFormat(str: string, format: 'standard' | 'compact' | 'clean'): boolean; 