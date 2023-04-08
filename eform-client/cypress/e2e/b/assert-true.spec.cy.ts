// create canary in a coal mine test asserting true
it('asserts true', () => {
  // @ts-ignore
  expect(true).to.be.true // this will pass
});
