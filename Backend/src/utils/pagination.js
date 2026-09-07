export function pagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

export function pageResult(rows, total, { page, limit }) {
  return { data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
