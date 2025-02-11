const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const db = require('../index'); // Import the database connection

// ... (JWT_SECRET from index.js and authenticate middleware - same as before)

router.post('/', authenticate, async (req, res) => {
    const { train_id, booking_date, seat_number } = req.body;
    const userId = req.user.userId;

    try {
        await db.execute('START TRANSACTION'); // Start transaction

        const [trainResult] = await db.execute(
            'SELECT total_seats FROM trains WHERE id = ? FOR UPDATE', // Row-level locking
            [train_id]
        );

        if (trainResult.length === 0) {
            return res.status(404).json({ error: 'Train not found' });
        }

        // Check if the seat is already booked (within the transaction)
        const [bookingCheck] = await db.execute(
            'SELECT 1 FROM bookings WHERE train_id = ? AND booking_date = ? AND seat_number = ?',
            [train_id, booking_date, seat_number]
        );

        if (bookingCheck.length > 0) {
            await db.execute('ROLLBACK');
            return res.status(400).json({ error: 'Seat already booked' });
        }

        const bookingId = await Booking.create(userId, train_id, booking_date, seat_number);

        await db.execute('COMMIT');
        res.status(201).json({ message: 'Booking successful', bookingId }); // Include booking ID
    } catch (error) {
        await db.execute('ROLLBACK');
        console.error("Error booking seat:", error); // More specific logging
        res.status(500).json({ error: error.message });
    }
});

router.get('/:bookingId', authenticate, async (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId;

    try {
        const booking = await Booking.findByIdAndUser(bookingId, userId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        console.error("Error getting booking details:", error);
        res.status(500).json({ error: error.message });
    }
});


// ... (Add other booking-related routes as needed - e.g., to get bookings by user, train, etc.)

module.exports = router;