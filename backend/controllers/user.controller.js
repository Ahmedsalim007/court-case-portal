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

const PROTECTED_DEMO_IDS = ['100001', '100002'];

export const deleteUser = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (PROTECTED_DEMO_IDS.includes(employeeId)) {
      return res.status(403).json({
        success: false,
        message: 'This is a demo account and cannot be deleted',
      });
    }

    if (employeeId === req.user.employeeId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const targetUser = await User.findOne({ employeeId });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (targetUser.role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin' });
      if (adminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete the last remaining admin',
        });
      }
    }

    await User.findOneAndDelete({ employeeId });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
