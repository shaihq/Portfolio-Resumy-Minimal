const fs = require('fs');
const babel = require('@babel/core');
const code = fs.readFileSync('client/src/pages/home.tsx', 'utf8');

try {
  babel.transformSync(code, {
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
    filename: 'client/src/pages/home.tsx'
  });
  console.log("Parsed successfully");
} catch (e) {
  console.error(e.message);
}
