import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {

  try {
    const booking = await bookingServices.createBookingIntoDB(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking.booking,
        vehicle: booking.vehicle,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

// const getAllVehicles = async (req: Request, res: Response) => {
//   try {
//     const vehicles = await vehicleServices.getAllVehiclesFromDB();

//     const formattedData = vehicles.rows.map((vehicle) => ({
//       ...vehicle,
//       daily_rent_price: Number(vehicle.daily_rent_price),
//     }));

//     return res.status(201).json({
//       success: true,
//       message: "Vehicles retrieved successfully",
//       data: formattedData,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: true,
//       message: error.message,
//     });
//   }
// };

// const getVehicleById = async (req: Request, res: Response) => {
//   try {
//     const { vehicleId } = req.params;

//     const vehicle = await vehicleServices.getVehicleByIdFromDB(
//       vehicleId as string,
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Vehicle retrieved successfully",
//       data: {
//         ...vehicle.rows[0],
//         daily_rent_price: Number(vehicle.rows[0].daily_rent_price),
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const updateVehicle = async (req: Request, res: Response) => {
//   try {
//     const { vehicleId } = req.params;
//     const payload = { ...req.body };

//     const vehicle = await vehicleServices.updateVehicleFromDB(
//       vehicleId as string,
//       payload,
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Vehicle updated successfully",
//          data: {
//         ...vehicle.rows[0],
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// const deleteVehicle = async (req: Request, res: Response) => {
//   try {
//     const { vehicleId } = req.params;

//     const vehicle = await vehicleServices.deleteVehicleFromDB(
//       vehicleId as string,
//     );

//     if (vehicle.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vehicle not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Vehicle deleted successfully",
//     });
//   } 

//   catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const bookingController = {
  createBooking,
//   getAllVehicles,
//   getVehicleById,
//   updateVehicle,
//   deleteVehicle
};
