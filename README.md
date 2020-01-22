## rutify
Libreria npm, puedes darle formato y validar rut Chileno.

```bash
npm install --save rutify-cl
```

```js
const rut = require('rutify');
// da formato a rut chileno de la forma xx.xxx.xxx-x
const a = rut.rutify('18927589-7');
const b = rut.rutify('18.927.589-7');
const c = rut.rutify('20901792K');
const d = rut.rutify('18927589');

// muestra en consola el rut con formato y verifica si es valido
console.log(a, rut.validateRut(a));
console.log(b, rut.validateRut(b));
console.log(c, rut.validateRut(c));
console.log(d, rut.validateRut(d));
