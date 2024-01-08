const sendError = (err, res) => {
  res.json({
    status: err.status,
    statusCode:err.statusCode,
    message: err.message,
    data: null,
  });
};

export default (err, req, res, next) => {
  sendError(err, res);
};