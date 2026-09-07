export function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function failure(res, message, statusCode = 400, code = 'BAD_REQUEST') {
  return res.status(statusCode).json({ success: false, message, code });
}
