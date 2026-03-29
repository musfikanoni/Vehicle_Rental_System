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

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bookings = await bookingServices.getAllBookingsFromDB(user);

    let formattedData;

    if (user.role === "admin") {
      formattedData = bookings.map((b: any) => ({
        id: b.id,
        customer_id: b.customer_id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        customer: {
          name: b.customer_name,
          email: b.customer_email,
        },
        vehicle: {
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
        },
      }));
    } else {
      formattedData = bookings.map((b: any) => ({
        id: b.id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        vehicle: {
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
          type: b.type,
        },
      }));
    }

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: formattedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const booking = await bookingServices.updateBookingFromDB(
      bookingId as string,
      status,
      user
    );

    return res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking
};
