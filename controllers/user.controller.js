import { User } from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { fullName, employeeId, password, role } = req.body;

    if (typeof employeeId !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }

    const user = await User.create({
      fullName,
      employeeId,
      password,
      role: role || 'Clerk',
    });
    res
      .status(201)
      .json({
        success: true,
        data: {
          fullName: user.fullName,
          employeeId: user.employeeId,
          role: user.role,
        },
        message: 'User created',
      });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res
      .status(200)
      .json({
        success: true,
        data: users,
        count: users.length,
        message: 'Users fetched',
      });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      employeeId: req.params.employeeId,
    }).select('-password');
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    res
      .status(200)
      .json({ success: true, data: user, message: 'User fetched' });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({
      employeeId: req.params.employeeId,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
