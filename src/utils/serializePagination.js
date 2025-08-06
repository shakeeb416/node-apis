// utils/serializePagination.js
const serializePagination = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    total,
    page,
    limit,
    totalPages,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

module.exports = serializePagination;
