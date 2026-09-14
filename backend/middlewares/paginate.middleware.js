
export const paginate = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  ;
   req.pagination = {pageNum, limitNum, skip};
  next(); 
};

