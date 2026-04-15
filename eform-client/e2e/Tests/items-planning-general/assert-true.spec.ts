const expect = require('chai').expect;
import { $ } from '@wdio/globals';
// create canary in a coal mine test asserting true
it('asserts true', () => {
  // @ts-ignore
  expect(true).eq(true) // this will pass
});
