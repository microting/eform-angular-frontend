import {Guid} from 'guid-typescript';

export function generateRandmString() {
  return Guid.raw();
}
