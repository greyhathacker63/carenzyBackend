const _ = require('lodash');

_.mixin({
  pluck: (list, valueKey, indexKey) => {
    if (indexKey) {
      const result = {};
      for (const v of list) {
        result[v[indexKey]] = valueKey ? v[valueKey] : v;
      }

      return result;
    }

    return list.map(v => v[valueKey]);
  },
});
