export function parseJSON(response) {
  return response.json();
}

export function checkStatus(response = {}) {
  // if our response is valid then simply return the response
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // throw an error here to be caught by our promise chain's catch
  // and add the error object details along with the error thrown
  throw new Error(response.status);
}

export function handleErrors(response) {
  // throw an error here to be caught by our promise chain's catch
  // and add the error object details along with the error thrown
  if (response.errorCode) {
    throw new Error(response.errorCode);
  }
  // otherwise handle the success
  return response;
}

export function get(endpoint = '', request = {}, parseResponse = true) {
  if (!endpoint) {
    throw new Error('making an api request without an endpoint is not allowed');
  } else if (typeof endpoint !== 'string') {
    throw new Error(`making an api request requires an endpoint with the type of string but ${typeof endpoint} was provided`);
  }
  // merge the default request object with any overrides
  // in-order to maintain the session cookie we need the
  // credentials property as below
  const req = Object.assign(
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    request,
  );
  // when the response resolves we check the status as fetch won't
  // reject on HTTP error status even if the response is an HTTP 404 or 500
  //
  // then parse the json from a successful response
  return fetch(endpoint, req)
    .catch((e) => {
      throw new Error(`error: ${JSON.stringify(e)}`);
    })
    .then(checkStatus)
    .then(parseResponse ? parseJSON : r => r)
    .then(handleErrors);
}
