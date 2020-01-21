function rutify(str) {
	let clearRut = typeof str === 'string' ? str.replace(/[^0-9kK]+/g, '').toUpperCase() : '' // limpiamos la variable rut
	if (clearRut.length <= 1) {
		return false
	}
	var result = clearRut.slice(-4, -1) + '-' + clearRut.substr(clearRut.length - 1)
	for (var i = 4; i < clearRut.length; i += 3) {
	result = clearRut.slice(-3 - i, -i) + '.' + result
	}
	str = result
	if (typeof str !== 'string') {
		return false
	}
	return str;
}

function validateRut(str) {
	rut = typeof str === 'string' ? str.replace(/[^0-9kK]+/g, '').toUpperCase() : ''
	var rutDigits = parseInt(rut.slice(0, -1), 10)
	var m = 0
	var s = 1
	while (rutDigits > 0) {
		s = (s + rutDigits % 10 * (9 - m++ % 6)) % 11
		rutDigits = Math.floor(rutDigits / 10)
	}
	var checkDigit = (s > 0) ? String((s - 1)) : 'K'
	if (checkDigit === rut.slice(-1)) {
		return true;
	} else {
		return false;
	}
}

module.exports = { rutify: rutify, validateRut: validateRut }
