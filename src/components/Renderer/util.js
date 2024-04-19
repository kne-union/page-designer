export const titleCase = str => {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

/*export const traversal = (target, callback) => {
  if (Array.isArray(target)) {
    return target.map((targetItem) => traversal(targetItem, callback));
  }
  if (typeof target === 'object') {
    const output = {};
    Object.keys(target).forEach((targetKey) => {
      const targetItem = target[targetKey];
      output[targetKey] = traversal(targetItem, callback);
    });
    return output;
  }
  return callback(target);
};*/

export const escape = value => {
  if (typeof value === 'string' && value.indexOf('\\$') === 0) {
    return value.replace('\\$', '$');
  }
  return value;
};

export const parseVariable = value => {
  if (typeof value !== 'string') {
    return {
      name: value,
      path: ''
    };
  }
  if (!/[.[]/.test(value)) {
    return {
      name: value,
      path: ''
    };
  }
  const dotIndexList = ['[', '.'].map(sign => value.indexOf(sign)).filter(index => index > -1);
  if (dotIndexList.length === 0) {
    return {
      name: value,
      path: ''
    };
  }
  const dotIndex = Math.min(...dotIndexList);
  return {
    name: value.slice(0, dotIndex),
    path: value.slice(dotIndex).replace(/^\./, '')
  };
};
