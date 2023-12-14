import asyncWrapper from '../Middleware/AsyncWrapper.js'
import HttpStatusText from '../Utilis/HttpStatusText.js'
import Usermodel from '../Models/UserModel.js'
import AppError from '../Utilis/AppError.js';

export const getusers = asyncWrapper( async (req, res, next) => {
  const users = await Usermodel.find();
  res.status(200).json({
    state: HttpStatusText.SUCCESS,
    users
  })
});

export const getOneUser = asyncWrapper(async (req, res, next) => {
  const user = await Usermodel.findById(req.params.id);
  if (!user) {
    return next(new AppError('not user found', 404, HttpStatusText.FAIL))
  }
  res.status(200).json({
    state: HttpStatusText.SUCCESS,
    data: {
      user,
    },
  });
});

export const deleteMe = asyncWrapper(async (req, res, next) => {
  await Usermodel.deleteOne({ _id: req.user._id });
  res.status(204).json({
    state: HttpStatusText.SUCCESS,
    data: null
  });
});