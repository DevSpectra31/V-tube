// const asyncHandler=(requestHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
//     }
// }
// export{asyncHandler}
// src/utils/asyncHandler.js (recommended)
const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { asyncHandler };