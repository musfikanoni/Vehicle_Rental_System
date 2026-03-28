import { Request, Response } from "express";
import { userServices } from "./user.service";
import { Roles } from "../auth/auth.constant";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUserFromDB();
    return res.status(201).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payload = { ...req.body };

    const loggedInUser = req.user;

    if (
      loggedInUser?.role === Roles.customer &&
      loggedInUser.userId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

     if (loggedInUser?.role === Roles.customer && payload.role) {
      delete payload.role;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update",
      });
    }

    const user = await userServices.updateUserFromDB(
      userId as string,
      payload,
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
         data: {
        ...user.rows[0],
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await userServices.deleteUserFromDB(
      userId as string,
    );

    if (user.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } 

  catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser
};
