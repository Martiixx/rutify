# Rutify

A Node.js library for formatting and validating Chilean RUT (Rol Único Tributario) numbers.

## What is a Chilean RUT?

The RUT (Rol Único Tributario) is Chile's national identification number, similar to a Social Security Number in the United States. It consists of:

- **Body**: 7-8 digits (the main number)
- **Check digit**: 1 digit or 'K' (validation character)

The RUT is formatted as `XX.XXX.XXX-X` where:
- `XX.XXX.XXX` is the body with dots as thousand separators
- `-X` is the check digit (can be a number 0-9 or 'K')

## Installation

```bash
npm install --save rutify-cl
```

## Usage

### Import the library

```javascript
const rutify = require('rutify');
```

### Format a RUT

The `rutify()` function takes any string containing a RUT and formats it to the standard Chilean format `XX.XXX.XXX-X`.

```javascript
// Examples of input formats that will be formatted
const formatted1 = rutify('18927589-7');     // Returns: "18.927.589-7"
const formatted2 = rutify('18.927.589-7');   // Returns: "18.927.589-7"
const formatted3 = rutify('20901792K');      // Returns: "20.901.792-K"
const formatted4 = rutify('18927589');       // Returns: "1.892.758-9"
const formatted5 = rutify('1.892.758-9');    // Returns: "1.892.758-9"

// Invalid inputs return false
const invalid1 = rutify('');                 // Returns: false
const invalid2 = rutify('123');              // Returns: false
const invalid3 = rutify(null);               // Returns: false
```

### Validate a RUT

The `validateRut()` function checks if a RUT is valid by verifying the check digit using the Chilean validation algorithm.

```javascript
// Valid RUTs
console.log(validateRut('18.927.589-7'));    // true
console.log(validateRut('20.901.792-K'));    // true
console.log(validateRut('18927589-7'));      // true

// Invalid RUTs
console.log(validateRut('18.927.589-8'));    // false (wrong check digit)
console.log(validateRut('20.901.792-1'));    // false (wrong check digit)
console.log(validateRut(''));                // false
```

### Complete Example

```javascript
const rutify = require('rutify');

// Test various RUT formats
const testRuts = [
    '18927589-7',
    '18.927.589-7', 
    '20901792K',
    '18927589',
    'invalid-rut'
];

testRuts.forEach(rut => {
    const formatted = rutify.rutify(rut);
    const isValid = rutify.validateRut(rut);
    
    console.log(`Input: ${rut}`);
    console.log(`Formatted: ${formatted}`);
    console.log(`Valid: ${isValid}`);
    console.log('---');
});
```

Output:
```
Input: 18927589-7
Formatted: 18.927.589-7
Valid: true
---
Input: 18.927.589-7
Formatted: 18.927.589-7
Valid: true
---
Input: 20901792K
Formatted: 20.901.792-K
Valid: true
---
Input: 18927589
Formatted: 1.892.758-9
Valid: false
---
Input: invalid-rut
Formatted: false
Valid: false
---
```

## API Reference

### `rutify(str)`

Formats a RUT string to the standard Chilean format `XX.XXX.XXX-X`.

**Parameters:**
- `str` (string): The RUT string to format. Can contain numbers, dots, dashes, and 'K'.

**Returns:**
- `string`: Formatted RUT in `XX.XXX.XXX-X` format
- `false`: If the input is invalid or too short

**Examples:**
```javascript
rutify('18927589-7')     // "18.927.589-7"
rutify('20901792K')      // "20.901.792-K"
rutify('')               // false
```

### `validateRut(str)`

Validates a RUT using the Chilean validation algorithm.

**Parameters:**
- `str` (string): The RUT string to validate

**Returns:**
- `boolean`: `true` if the RUT is valid, `false` otherwise

**Validation Algorithm:**
The function uses the official Chilean RUT validation algorithm:
1. Extracts the body (all digits except the last one)
2. Multiplies each digit by weights (2, 3, 4, 5, 6, 7, 2, 3...)
3. Sums all products
4. Calculates the check digit using the formula: `11 - (sum % 11)`
5. Compares the calculated check digit with the provided one

**Examples:**
```javascript
validateRut('18.927.589-7')    // true
validateRut('20.901.792-K')    // true
validateRut('18.927.589-8')    // false
```

## Input Format Support

The library accepts RUTs in various formats:

- `18927589-7` (plain with dash)
- `18.927.589-7` (formatted)
- `20901792K` (plain with K)
- `20.901.792-K` (formatted with K)
- `18927589` (plain without check digit - will be formatted but validation will fail)

## Error Handling

- **Empty strings**: Return `false` for formatting, `false` for validation
- **Invalid characters**: Non-numeric characters (except 'K') are stripped
- **Too short**: RUTs with less than 2 characters return `false` for formatting
- **Null/undefined**: Return `false` for both functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Author

Martin Carrasco

## Related

- [Chilean RUT Wikipedia](https://en.wikipedia.org/wiki/National_identification_number#Chile)
- [RUT Validation Algorithm](https://es.wikipedia.org/wiki/Rol_%C3%9Anico_Tributario#Algoritmo_para_obtener_el_d%C3%ADgito_verificador)

```bash
npm install --save rutify-cl
```