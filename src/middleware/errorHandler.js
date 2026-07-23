export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(' ');
    return res.status(400).json({ message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'An account with that email address already exists.' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'The supplied resource identifier is invalid.' });
  }

  const status = error.status || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred.'
    : error.message || 'An unexpected server error occurred.';

  return res.status(status).json({ message });
}
