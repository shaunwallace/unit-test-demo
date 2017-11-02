import * as fn from './index';

describe('getDataType', () => {
  it('should return true if the value given matches the type given', () => {
    /* brute force method */
    // expect(fn.getDataType({}, 'object')).toEqual(true);
    // expect(fn.getDataType([], 'array')).toEqual(true);
    // expect(fn.getDataType(() => {}, 'function')).toEqual(true);

    /* alternative/iterative approach for multiple assertions in one go */
    const types = new Map([
      [{}, 'object'],
      [[], 'array'],
      [() => {}, 'function'],
      [null, 'null'],
      [undefined, 'undefined'],
      [1, 'number'],
      ['', 'string'],
      [Symbol, 'function'],
      [NaN, 'number'],
      [true, 'boolean'],
    ]);

    types.forEach((value, key) => {
      expect(fn.getDataType(key, value)).toEqual(true);
      // check for uppercase types as well in the same pass
      expect(fn.getDataType(key, value.toUpperCase())).toEqual(true);
    });
  });

  it('should return false if the value given does not match the type given', () => {
    const types = new Map([
      [{}, 'array'],
      [[], 'object'],
      [() => {}, 'string'],
      [null, 'object'],
      [undefined, 'null'],
      [1, 'boolean'],
      ['', 'array'],
      [Symbol, 'object'],
      [NaN, 'boolean'],
      [true, 'string'],
    ]);

    types.forEach((value, key) => {
      expect(fn.getDataType(key, value)).toEqual(false);
    });
  });

  it('should throw an error when the given type param is not a string', () => {
    const types = [{}, [], 1, false, null, undefined, NaN, () => {}];
    types.forEach((type) => {
      // verify that the error throw includes the data type of the given type param
      expect(() => {
        fn.getDataType(null, type);
      }).toThrow(new RegExp(typeof type));
    });
  });
});

describe('removeNonAlphaCharaters', () => {
  it('should strip out all non-alpha characters from a given string', () => {
    const scenarios = new Map([
      ['foo123bar', 'foobar'],
      ['/', ''],
      ['123bar', 'bar'],
      ['{foo}', 'foo'],
      [
        'qkjdnqwd1232qwjknjqwn&*Y)(**)!@£$%^&_wedjnkwdewndwend',
        'qkjdnqwdqwjknjqwnYwedjnkwdewndwend',
      ],
    ]);

    scenarios.forEach((value, key) => {
      expect(fn.removeNonAlphaCharaters(key)).toEqual(value);
    });
  });
});

// explicit assertions
describe('isEmpty', () => {
  it('should return true when the value given is an empty string', () => {
    expect(fn.isEmpty('')).toEqual(true);
  });

  it('should return true when the value given is an empty object', () => {
    expect(fn.isEmpty({})).toEqual(true);
  });

  it('should return true when the value given is an empty array', () => {
    expect(fn.isEmpty([])).toEqual(true);
  });

  it('should return false when the value given is an non-empty string', () => {
    expect(fn.isEmpty('foo')).toEqual(false);
  });

  it('should return false when the value given is an non-empty object', () => {
    expect(fn.isEmpty({ foo: 'bar' })).toEqual(false);
  });

  it('should return false when the value given is an non-empty array', () => {
    /* special case */
    expect(fn.isEmpty([1])).toEqual(false);
  });

  it('should return false when the value given is a boolean', () => {
    expect(fn.isEmpty(false)).toEqual(false);
  });

  it('should return false when the value given is a number', () => {
    expect(fn.isEmpty(0)).toEqual(false);
  });
});
