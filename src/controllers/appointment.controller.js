import { db } from "../prisma/db";

export const createAppointment = async (req, res) => {
    try{
        const { title, description, scheduledAt } = req.body;
        const userId = req.user.userId;

        if(!title || !scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Title and ScheduledAt are required."
            })
        }

        const appointment = await db.appointment.create({
            data: {
                title,
                description,
                scheduledAt: new Date(scheduledAt),
                userId,
            }
        })

        return res.status(201).json({
            success: true, 
            message: "Appointment created successfully",
            appointment,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// 2. Get User Appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await db.appointment.findMany({
      where: { userId: req.user.userId },
      orderBy: { scheduledAt: "asc" },
    });
    return res.json({ appointments });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error", 
        error: error.message 
    });
  }
};

// 3. Cancel Appointment (Will trigger cancellation notification & cancel scheduled reminder!)
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment || appointment.userId !== req.user.userId) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });
    // NOTE: Here we will cancel pending reminder jobs & send cancellation email!
    return res.json({ message: "Appointment cancelled", appointment: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};