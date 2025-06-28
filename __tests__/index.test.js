const {
  rutify,
  validateRut,
  rutifyAndValidate,
  extractBody,
  extractCheckDigit,
  generateCheckDigit
} = require('../index.js');

describe('Rutify Main Features', () => {
  describe('rutify()', () => {
    it('formats valid RUTs to standard format', () => {
      expect(rutify('18927589-7')).toBe('18.927.589-7');
      expect(rutify('20901792K')).toBe('20.901.792-K');
      expect(rutify('18.927.589-7')).toBe('18.927.589-7');
    });
    it('returns false for invalid RUTs', () => {
      expect(rutify('')).toBe(false);
      expect(rutify(null)).toBe(false);
    });
  });

  describe('validateRut()', () => {
    it('validates correct RUTs', () => {
      expect(validateRut('18.927.589-7')).toBe(true);
      expect(validateRut('20.901.792-K')).toBe(true);
      expect(validateRut('18927589-7')).toBe(true);
    });
    it('invalidates incorrect RUTs', () => {
      expect(validateRut('18.927.589-8')).toBe(false);
      expect(validateRut('20.901.792-1')).toBe(false);
      expect(validateRut('')).toBe(false);
    });
  });

  describe('rutifyAndValidate()', () => {
    it('returns formatted and valid result for correct RUT', () => {
      const result = rutifyAndValidate('18927589-7');
      expect(result.formatted).toBe('18.927.589-7');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.body).toBe('18927589');
      expect(result.checkDigit).toBe('7');
    });
    it('returns false and error for invalid RUT', () => {
      const result = rutifyAndValidate('');
      expect(result.formatted).toBe(false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('extractBody()', () => {
    it('extracts the body from a valid RUT', () => {
      expect(extractBody('18.927.589-7')).toBe('18927589');
      expect(extractBody('20901792K')).toBe('20901792');
    });
    it('returns false for invalid RUT', () => {
      expect(extractBody('')).toBe(false);
    });
  });

  describe('extractCheckDigit()', () => {
    it('extracts the check digit from a valid RUT', () => {
      expect(extractCheckDigit('18.927.589-7')).toBe('7');
      expect(extractCheckDigit('20901792K')).toBe('K');
    });
    it('returns false for invalid RUT', () => {
      expect(extractCheckDigit('')).toBe(false);
    });
  });

  describe('generateCheckDigit()', () => {
    it('generates the correct check digit for a valid body', () => {
      expect(generateCheckDigit('18927589')).toBe('7');
      expect(generateCheckDigit('20901792')).toBe('K');
    });
    it('returns false for invalid body', () => {
      expect(generateCheckDigit('')).toBe(false);
      expect(generateCheckDigit('abc')).toBe(false);
    });
  });
}); 