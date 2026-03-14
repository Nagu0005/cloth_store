const db = require('../config/db');

class UserRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async findById(id) {
        const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(user) {
        const { name, email, password_hash } = user;
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, password_hash]
        );
        return result.rows[0];
    }
}

module.exports = new UserRepository();
