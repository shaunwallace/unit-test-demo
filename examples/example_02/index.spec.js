import * as fn from './index';

describe('Returning json from fetch api call', () => {
  it('should return the json representation of a provided response object', () => {
    const response = { json: () => ({ foo: 'bar' }) };
    const actual = fn.parseJSON(response);
    const expected = { foo: 'bar' };
    expect(actual).toEqual(expected);
  });
});

describe('Erorr handling of improper endpoint', () => {
  it('should throw and error when the given endpoint param is not a valid string', () => {
    const types = ['', 0, false, null, undefined];

    types.forEach((type) => {
      expect(() => fn.get(type)).toThrow(new Error('making an api request without an endpoint is not allowed'));
    });
  });

  it('should throw an error when the endpoint param is not falsy', () => {
    const types = [{}, [], () => {}, 1, true];

    types.forEach((type) => {
      expect(() => fn.get(type)).toThrow(new Error(`making an api request requires an endpoint with the type of string but ${typeof type} was provided`));
    });
  });

  it('should throw an error when the response is invalid', async () => {
    fetch.mockRejectOnce(500);
    expect.assertions(1);
    // return expect(get('google.com/test')).rejects.toEqual(new Error(`error: ${JSON.stringify(500)}`));
    await expect(fn.get('google.com/test')).rejects.toEqual(new Error(`error: ${JSON.stringify(undefined)}`));
  });
});

describe('Handling failed requests', () => {
  it('should throw an error when a response contains an error code', () => {
    expect(() => fn.handleErrors({ errorCode: '10001' })).toThrow(new Error(10001));
  });

  it('should return the response when no error code is found', () => {
    expect(fn.handleErrors({ errorCode: null })).toEqual({ errorCode: null });
  });
});

describe('Promise chain of rest api calls', () => {
  it('should call the checkStatus method when the fetch method is called and does not throw and error', async () => {
    const res = JSON.stringify({ access_token: '12345' });
    fetch.mockResponseOnce(res);
    expect.assertions(1);
    // make the fetch request
    const response = await fn.get('/authenticate');
    // assert that the response was handled correctly
    expect(response).toMatchObject(JSON.parse(res));
  });

  it('should throw an error when the checkStatus method is called with a given error code within the range of >= 200 && < 300', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 400 });
    expect.assertions(1);
    try {
      // make the fetch request
      await await fn.get('/authenticate');
    } catch (e) {
      expect(e).toEqual(new Error(400));
    }
  });

  it('should return the raw Response object when the given parseResponse is false', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
    expect.assertions(1);
    const response = await fn.get('/authenticate', {}, false);
    // matches anything that was created with the given constructor, in this case the Response object
    expect(response).toEqual(expect.any(Response));
  });
});

describe('Handling invalid HTTP status codes', () => {
  it('should throw an error when the given status code is < 200 || > 300', () => {
    [0, 100, 199, 301, 302].forEach(code =>
      expect(() => fn.checkStatus({ status: code })).toThrow(new Error(code)));
  });

  it('should throw an error when there is no given status code', () => {
    expect(() => fn.checkStatus()).toThrow(new Error(undefined));
  });

  it('should return the response when the status code is within the appropriate range', () => {
    [200, 299].forEach(code =>
      expect(fn.checkStatus({ status: code })).toMatchObject({ status: code }));
  });
});
