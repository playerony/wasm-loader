import wasmLoader from '..';

describe('wasmLoader Function', () => {
  test('should import', () => {
    expect(typeof wasmLoader).toStrictEqual('function');
  });
});
