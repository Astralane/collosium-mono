import * as crypto from 'crypto';

export function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}
