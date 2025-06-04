// test-db.js
const db = require('./database');

db.query('SELECT 1 + 1 AS resultado', (err, rows) => {
    if (err) throw err;
    console.log('🧪 Resultado de prueba:', rows[0].resultado);
});
