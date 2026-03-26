import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.createVehicleIntoDB(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getAllVehiclesFromDB();
    return res.status(201).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const result = await vehicleServices.getVehicleByIdFromDB(vehicleId as string,);

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
};
