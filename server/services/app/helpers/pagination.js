const DEFAULT_LIMIT = 5
const DEFAULT_OFFSET = 0

const getPagination = (page, size) => {
  const limit = size ? +size : DEFAULT_LIMIT;
  const offset = page ? page * limit : DEFAULT_OFFSET;
  return { limit, offset };
};

module.exports = { getPagination };