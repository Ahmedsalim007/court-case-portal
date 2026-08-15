export const errorHandler = (err, req, res, next) => {
  const { context = 'Operation failed' } = err;
  


  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: context,
      error: err.message,
    });
  }
   if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Case number already exists',
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: err.message,
  });
};