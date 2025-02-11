const db = require('../index');

class Booking {
    static async create(userId, trainId, bookingDate, seatNumber) {
        try {
            const [result] = await db.execute(
                'INSERT INTO bookings (user_id, train_id, booking_date, seat_number) VALUES (?, ?, ?, ?)',
                [userId, trainId, bookingDate, seatNumber]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    }

    static async findByIdAndUser(bookingId, userId) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
                [bookingId, userId]
            );
            return rows[0];
        } catch (error) {
            console.error("Error finding booking:", error);
            throw error;
        }
    }
}

module.exports = Booking;