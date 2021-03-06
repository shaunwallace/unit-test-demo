export function removeNonAlphaCharacters(str) {
  return str.replace(/[^A-Za-z]/g, '');
}

export function getDataType(value, type) {
  if (typeof type !== 'string') {
    throw new Error(
      `unsupported type param provided to getDataType: ${typeof type}`,
    );
  }

  const typeToString = Object.prototype.toString.call(value);

  return (
    removeNonAlphaCharacters(
      typeToString
        .split(/\s/)
        .pop()
        .toLowerCase(),
    ) === type.toLowerCase()
  );
}

export function typeFactory(type) {
  return value => getDataType(value, type);
}

const isArray = typeFactory('array');
const isObject = typeFactory('object');

export function isEmpty(value) {
  const type = typeof value;
  // if the value is an array or object then check for the length of
  // the keys else check for an empty string and booleans and number types constitute a non empty value
  return (
    ((isArray(value) || isObject(value)) &&
      !Object.keys.call(null, value).length) ||
    (type !== 'boolean' && type !== 'number' && !value)
  );
}
