## rutify
Libreria npm, puedes darle formato y validar rut Chileno.

```bash
npm install --save rutify
```

```js

const rut = require('rutify');
const a = rut.rutify('18927589-7');
const b = rut.rutify('18.927.589-7');
const c = rut.rutify('20901792K');
const d = rut.rutify('18927589');
const e = rut.rutify('999999999');

console.log(a, rut.validateRut(a));
console.log(b, rut.validateRut(b));
console.log(c, rut.validateRut(c));
console.log(d, rut.validateRut(d));
console.log(e, rut.validateRut(e));
