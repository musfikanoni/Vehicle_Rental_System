import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";


const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicleIntoDB(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

// const getAllUser = async (req: Request, res: Response) => {
//   try {
//     const result = await userServices.getAllUserFromDB();
//     return res.status(201).json({
//       success: true,
//       message: "Users received successfully",
//       data: result.rows,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: true,
//       message: error.message,
//     });
//   }
// };

export const vehicleController = {
  createVehicle,
//   getAllUser,
};
