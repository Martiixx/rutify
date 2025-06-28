/**
 * @typedef {Object} RutifyOptions
 * @property {string} [separator='.'] - Character to use as thousand separator
 * @property {boolean} [strict=false] - Whether to use strict validation mode
 * @property {boolean} [normalize=true] - Whether to normalize input before processing
 * @property {string} [format='standard'] - Output format: 'standard', 'compact', 'clean'
 */

/**
 * @typedef {Object} RutifyResult
 * @property {string|false} formatted - The formatted RUT string or false if invalid
 * @property {boolean} isValid - Whether the RUT is valid
 * @property {string|null} error - Error message if any
 * @property {string|null} body - The RUT body (digits only)
 * @property {string|null} checkDigit - The check digit
 */

/**
 * Custom error classes for better error handling
 */
class RutifyError extends Error {
	constructor(message, code, details = {}) {
		super(message);
		this.name = 'RutifyError';
		this.code = code;
		this.details = details;
	}
}

class RutifyValidationError extends RutifyError {
	constructor(message, details = {}) {
		super(message, 'VALIDATION_ERROR', details);
		this.name = 'RutifyValidationError';
	}
}

class RutifyFormatError extends RutifyError {
	constructor(message, details = {}) {
		super(message, 'FORMAT_ERROR', details);
		this.name = 'RutifyFormatError';
	}
}

/**
 * Default configuration for the library
 * @type {RutifyOptions}
 */
const DEFAULT_OPTIONS = {
	separator: '.',
	strict: false,
	normalize: true,
	format: 'standard'
};

/**
 * Validates and merges options with defaults
 * @param {RutifyOptions} options - User provided options
 * @returns {RutifyOptions} Merged and validated options
 * @private
 */
const validateAndMergeOptions = (options = {}) => {
	const merged = { ...DEFAULT_OPTIONS, ...options };
	
	// Validate separator
	if (typeof merged.separator !== 'string' || merged.separator.length !== 1) {
		throw new RutifyError('Separator must be a single character', 'INVALID_OPTION');
	}
	
	// Validate format
	const validFormats = ['standard', 'compact', 'clean'];
	if (!validFormats.includes(merged.format)) {
		throw new RutifyError(`Format must be one of: ${validFormats.join(', ')}`, 'INVALID_OPTION');
	}
	
	return merged;
};

/**
 * Enhanced input sanitization with multiple cleaning strategies
 * @param {string} str - The input string to sanitize
 * @param {boolean} normalize - Whether to normalize the input
 * @returns {string} The sanitized string
 * @private
 */
const sanitizeInput = (str, normalize = true) => {
	if (typeof str !== 'string') {
		return '';
	}
	
	let sanitized = str.trim();
	
	if (normalize) {
		// Remove all non-alphanumeric characters except 'K' and convert to uppercase
		sanitized = sanitized.replace(/[^0-9kK]+/g, '').toUpperCase();
	} else {
		// Only remove common separators but preserve structure
		sanitized = sanitized.replace(/[.\s-]/g, '').toUpperCase();
	}
	
	return sanitized;
};

/**
 * Cleans and normalizes a RUT string by removing non-alphanumeric characters
 * except for 'K' and converting to uppercase
 * @param {string} str - The input string to clean
 * @param {boolean} [normalize=true] - Whether to normalize the input
 * @returns {string} The cleaned RUT string
 * @private
 */
const cleanRutString = (str, normalize = true) => {
	return sanitizeInput(str, normalize);
};

/**
 * Validates if a string is a valid RUT input with enhanced validation
 * @param {string} str - The input string to validate
 * @param {boolean} [strict=false] - Whether to use strict validation
 * @returns {boolean} True if the input is valid
 * @private
 */
const isValidRutInput = (str, strict = false) => {
	if (typeof str !== 'string') {
		return false;
	}
	
	const cleaned = cleanRutString(str);
	
	// Basic length validation
	if (cleaned.length < 2) {
		return false;
	}
	
	// Strict validation requires proper format
	if (strict) {
		// Must end with digit or K, and body must be all digits
		return /^[0-9]+[0-9K]$/.test(cleaned) && /^[0-9]+$/.test(cleaned.slice(0, -1));
	}
	
	// Relaxed validation allows more flexible input
	return /^[0-9]+[0-9K]$/.test(cleaned);
};

/**
 * Utility function to check if a string is empty or whitespace
 * @param {string} str - The string to check
 * @returns {boolean} True if the string is empty or whitespace
 * @private
 */
const isEmptyString = (str) => {
	return typeof str !== 'string' || str.trim().length === 0;
};

/**
 * Utility function to validate RUT body (digits only)
 * @param {string} body - The RUT body to validate
 * @returns {boolean} True if the body is valid
 * @private
 */
const isValidRutBody = (body) => {
	return typeof body === 'string' && /^\d+$/.test(body) && body.length >= 1;
};

/**
 * Formats a Chilean RUT string to the standard format XX.XXX.XXX-X
 * @param {string} str - The RUT string to format
 * @param {RutifyOptions} [options={}] - Formatting options
 * @returns {string|false} The formatted RUT string or false if invalid
 * 
 * @example
 * // Basic formatting
 * rutify('18927589-7');     // Returns: "18.927.589-7"
 * rutify('20901792K');      // Returns: "20.901.792-K"
 * 
 * @example
 * // Custom separator
 * rutify('18927589-7', { separator: ' ' }); // Returns: "18 927 589-7"
 * 
 * @example
 * // Different formats
 * rutify('18927589-7', { format: 'compact' }); // Returns: "18927589-7"
 * rutify('18927589-7', { format: 'clean' });   // Returns: "189275897"
 * 
 * @example
 * // Invalid inputs
 * rutify('');               // Returns: false
 * rutify('123');            // Returns: false
 * rutify(null);             // Returns: false
 */
const rutify = (str, options = {}) => {
	try {
		const config = validateAndMergeOptions(options);
		
		// Input validation
		if (isEmptyString(str)) {
			return false;
		}
		
		if (!isValidRutInput(str, config.strict)) {
			return false;
		}

		const clearRut = cleanRutString(str, config.normalize);
		
		// Extract body and check digit
		const body = clearRut.slice(0, -1);
		const checkDigit = clearRut.slice(-1);
		
		// Apply different formatting based on format option
		switch (config.format) {
			case 'compact':
				return `${body}-${checkDigit}`;
			case 'clean':
				return `${body}${checkDigit}`;
			case 'standard':
			default:
				// Format the body with separators
				let formattedBody = '';
				for (let i = body.length - 1; i >= 0; i -= 3) {
					const start = Math.max(0, i - 2);
					const segment = body.slice(start, i + 1);
					formattedBody = segment + (formattedBody ? config.separator + formattedBody : formattedBody);
				}
				return `${formattedBody}-${checkDigit}`;
		}
	} catch (error) {
		if (error instanceof RutifyError) {
			console.warn('Rutify formatting error:', error.message);
		} else {
			console.warn('Rutify unexpected error:', error);
		}
		return false;
	}
};

/**
 * Validates a Chilean RUT using the official validation algorithm
 * @param {string} str - The RUT string to validate
 * @param {RutifyOptions} [options={}] - Validation options
 * @returns {boolean} True if the RUT is valid, false otherwise
 * 
 * @example
 * // Valid RUTs
 * validateRut('18.927.589-7');    // true
 * validateRut('20.901.792-K');    // true
 * validateRut('18927589-7');      // true
 * 
 * @example
 * // Invalid RUTs
 * validateRut('18.927.589-8');    // false (wrong check digit)
 * validateRut('20.901.792-1');    // false (wrong check digit)
 * validateRut('');                // false
 * 
 * @example
 * // Strict mode validation
 * validateRut('18927589', { strict: true }); // false (missing check digit)
 */
const validateRut = (str, options = {}) => {
	try {
		const config = validateAndMergeOptions(options);
		
		// Input validation
		if (isEmptyString(str)) {
			return false;
		}
		
		if (!isValidRutInput(str, config.strict)) {
			return false;
		}
		
		const clearRut = cleanRutString(str, config.normalize);
		
		// In strict mode, require the check digit to be present
		if (config.strict && clearRut.length < 2) {
			return false;
		}
		
		// Extract body and check digit
		const body = clearRut.slice(0, -1);
		const providedCheckDigit = clearRut.slice(-1);
		
		// Validate body is numeric
		if (!isValidRutBody(body)) {
			return false;
		}
		
		// Calculate check digit using Chilean algorithm
		const calculatedCheckDigit = generateCheckDigit(body);
		
		if (calculatedCheckDigit === false) {
			return false;
		}
		
		return calculatedCheckDigit === providedCheckDigit;
	} catch (error) {
		if (error instanceof RutifyError) {
			console.warn('Rutify validation error:', error.message);
		} else {
			console.warn('Rutify unexpected error:', error);
		}
		return false;
	}
};

/**
 * Formats and validates a RUT in a single operation
 * @param {string} str - The RUT string to process
 * @param {RutifyOptions} [options={}] - Processing options
 * @returns {RutifyResult} Object containing formatted RUT, validation status, and any errors
 * 
 * @example
 * const result = rutifyAndValidate('18927589-7');
 * console.log(result);
 * // {
 * //   formatted: "18.927.589-7",
 * //   isValid: true,
 * //   error: null,
 * //   body: "18927589",
 * //   checkDigit: "7"
 * // }
 */
const rutifyAndValidate = (str, options = {}) => {
	try {
		const config = validateAndMergeOptions(options);
		
		if (isEmptyString(str)) {
			return {
				formatted: false,
				isValid: false,
				error: 'Empty or invalid input',
				body: null,
				checkDigit: null
			};
		}
		
		const clearRut = cleanRutString(str, config.normalize);
		const body = clearRut.slice(0, -1);
		const checkDigit = clearRut.slice(-1);
		
		const formatted = rutify(str, config);
		const isValid = validateRut(str, config);
		
		return {
			formatted,
			isValid,
			error: null,
			body: isValidRutBody(body) ? body : null,
			checkDigit: isValidRutBody(body) ? checkDigit : null
		};
	} catch (error) {
		return {
			formatted: false,
			isValid: false,
			error: error.message,
			body: null,
			checkDigit: null
		};
	}
};

/**
 * Extracts the body (digits) from a RUT string
 * @param {string} str - The RUT string
 * @param {RutifyOptions} [options={}] - Processing options
 * @returns {string|false} The RUT body or false if invalid
 * 
 * @example
 * extractBody('18.927.589-7'); // "18927589"
 * extractBody('20901792K');    // "20901792"
 */
const extractBody = (str, options = {}) => {
	try {
		const config = validateAndMergeOptions(options);
		
		if (!isValidRutInput(str, config.strict)) {
			return false;
		}
		
		const clearRut = cleanRutString(str, config.normalize);
		const body = clearRut.slice(0, -1);
		
		return isValidRutBody(body) ? body : false;
	} catch (error) {
		console.warn('Rutify body extraction error:', error);
		return false;
	}
};

/**
 * Extracts the check digit from a RUT string
 * @param {string} str - The RUT string
 * @param {RutifyOptions} [options={}] - Processing options
 * @returns {string|false} The check digit or false if invalid
 * 
 * @example
 * extractCheckDigit('18.927.589-7'); // "7"
 * extractCheckDigit('20901792K');    // "K"
 */
const extractCheckDigit = (str, options = {}) => {
	try {
		const config = validateAndMergeOptions(options);
		
		if (!isValidRutInput(str, config.strict)) {
			return false;
		}
		
		const clearRut = cleanRutString(str, config.normalize);
		const body = clearRut.slice(0, -1);
		const checkDigit = clearRut.slice(-1);
		
		return isValidRutBody(body) ? checkDigit : false;
	} catch (error) {
		console.warn('Rutify check digit extraction error:', error);
		return false;
	}
};

/**
 * Generates a check digit for a RUT body
 * @param {string} body - The RUT body (digits only)
 * @returns {string|false} The calculated check digit or false if invalid
 * 
 * @example
 * generateCheckDigit('18927589'); // "7"
 * generateCheckDigit('20901792'); // "K"
 */
const generateCheckDigit = (body) => {
	try {
		if (!isValidRutBody(body)) {
			return false;
		}
		
		const rutDigits = parseInt(body, 10);
		let sum = 0;
		let multiplier = 2;
		
		let tempRut = rutDigits;
		while (tempRut > 0) {
			sum += (tempRut % 10) * multiplier;
			tempRut = Math.floor(tempRut / 10);
			multiplier = multiplier === 7 ? 2 : multiplier + 1;
		}
		
		const remainder = sum % 11;
		return remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder);
	} catch (error) {
		console.warn('Rutify check digit generation error:', error);
		return false;
	}
};

/**
 * Utility function to normalize a RUT string (remove all formatting)
 * @param {string} str - The RUT string to normalize
 * @returns {string|false} The normalized RUT string or false if invalid
 * 
 * @example
 * normalize('18.927.589-7'); // "189275897"
 * normalize('20 901 792-K'); // "20901792K"
 */
const normalize = (str) => {
	try {
		if (isEmptyString(str)) {
			return false;
		}
		
		const normalized = cleanRutString(str, true);
		return isValidRutInput(normalized, false) ? normalized : false;
	} catch (error) {
		console.warn('Rutify normalization error:', error);
		return false;
	}
};

/**
 * Utility function to check if a RUT is in a specific format
 * @param {string} str - The RUT string to check
 * @param {string} format - The format to check against ('standard', 'compact', 'clean')
 * @returns {boolean} True if the RUT matches the specified format
 * 
 * @example
 * isFormat('18.927.589-7', 'standard'); // true
 * isFormat('18927589-7', 'compact');    // true
 * isFormat('189275897', 'clean');       // true
 */
const isFormat = (str, format) => {
	try {
		if (isEmptyString(str) || typeof format !== 'string') {
			return false;
		}
		
		const formatted = rutify(str, { format });
		return formatted !== false && formatted === str;
	} catch (error) {
		console.warn('Rutify format check error:', error);
		return false;
	}
};

// Export all functions and classes
module.exports = {
	// Main functions
	rutify,
	validateRut,
	rutifyAndValidate,
	
	// Utility functions
	extractBody,
	extractCheckDigit,
	generateCheckDigit,
	normalize,
	isFormat,
	
	// Error classes
	RutifyError,
	RutifyValidationError,
	RutifyFormatError,
	
	// Constants
	DEFAULT_OPTIONS
};
