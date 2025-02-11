const db = require('../index');

class Train {
    static async create(train_number, source_station, destination_station, total_seats) {
        try {
            await db.execute(
                'INSERT INTO trains (train_number, source_station, destination_station, total_seats) VALUES (?, ?, ?, ?)',
                [train_number, source_station, destination_station, total_seats]
            );
        } catch (error) {
            console.error("Error creating train:", error);
            throw error;
        }
    }

    static async findAll(source, destination) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM trains WHERE source_station = ? AND destination_station = ?',
                [source, destination]
            );
            return rows;
        } catch (error) {
            console.error("Error finding trains:", error);
            throw error;
        }
    }
}

module.exports = Train;