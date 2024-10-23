const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// app.post('/calcular', (req, res) => {
//   const { tipo, lambda, mu, k } = req.body;
//   let resultado;

//   if (tipo === 'infinita') {
//     resultado = calcularColaInfinita(lambda, mu);
//   } else if (tipo === 'finita') {
//     resultado = calcularColaFinita(lambda, mu, k);
//   }

//   res.json(resultado);
// });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// function calcularColaInfinita(lambda, mu) {
//   const rho = lambda / mu;
//   const L = rho / (1 - rho);
//   const Lq = Math.pow(rho, 2) / (1 - rho);
//   const W = 1 / (mu - lambda);
//   const Wq = rho / (mu - lambda);

//   return { L, Lq, W, Wq };
// }

// function calcularColaFinita(lambda, mu, k) {
//   const rho = lambda / mu;
//   let p0 = 0;
//   for (let n = 0; n <= k; n++) {
//     p0 += Math.pow(rho, n);
//   }
//   p0 = 1 / p0;

//   const L = rho * (1 - Math.pow(rho, k + 1) * (k + 1 - k * rho)) / ((1 - rho) * (1 - Math.pow(rho, k + 1)));
//   const Lq = L - (1 - p0);
//   const W = L / (lambda * (1 - p0));
//   const Wq = Lq / (lambda * (1 - p0));

//   return {L, Lq, W, Wq };
// }