const db = require('../index'); 

class User {
    static async create(username, passwordHash, role) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                [username, passwordHash, role]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error creating user:", error); 
            throw error; 
        }
    }

    static async findByUsername(username) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (error) {
            console.error("Error finding user by username:", error);
            throw error;
        }
    }

    
}

module.exports = User;