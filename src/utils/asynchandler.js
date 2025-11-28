<<<<<<< HEAD
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
=======
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
>>>>>>> 3e6c18b187369461839562530e534df4c2e1bab4
    }
  };
};

export { asyncHandler };