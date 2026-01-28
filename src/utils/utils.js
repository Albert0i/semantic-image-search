
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

export function sha256FileSync(path) {
  const fileBuffer = readFileSync(path);   // read file into memory
  const hash = createHash('sha256');       // create SHA-256 hash object
  hash.update(fileBuffer);                 // feed file data
  return hash.digest('hex');               // return hex string
}

export function normalizeVector(vec) {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) return vec; // avoid division by zero
  return vec.map(v => v / norm);
}

// 3D vector
//console.log(normalizeVector([3, 4, 0]));
// → [0.6, 0.8, 0]

// 512D vector (CLIP embedding)
//const embedding512 = Array(512).fill(0.5); // example
//console.log(normalizeVector(embedding512).length);
// → 512 (normalized)
