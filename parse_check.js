import fs from 'fs';
import { parse } from '@babel/parser';

const code = fs.readFileSync('client/src/pages/home.tsx', 'utf8');

try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("Parsed successfully");
} catch (e) {
  console.error(e.message);
  console.error(`Line: ${e.loc?.line}, Column: ${e.loc?.column}`);
}
