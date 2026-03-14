const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-aurora';

class UserService {
    async registerUser(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(userData.password, salt);

        const newUser = await userRepository.create({
            name: userData.name,
            email: userData.email,
            password_hash
        });

        // Trigger Welcome Email asynchronously (fire-and-forget)
        this.triggerWelcomeEmail(newUser.email, newUser.name);

        const token = this.generateToken(newUser.id, newUser.email);
        return { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token };
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user.id, user.email);
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }

    async verifyAndGetUser(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await userRepository.findById(decoded.id);
            if (!user) throw new Error('User not found');
            return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    generateToken(id, email) {
        return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    }

    // Trigger HTTP Request to Email Service directly
    async triggerWelcomeEmail(email, name) {
        try {
            const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://email-service:7005/api/v1/emails';

            const payload = {
                recipient: email,
                subject: 'Welcome to Aurora Perfumes',
                body: `Hello ${name},\n\nWelcome to Aurora Perfumes! We are thrilled to have you join our exclusive club.\n\nDiscover the essence of elegance today.\n\nBest Regards,\nThe Aurora Team`,
                type: 'WELCOME'
            };

            // Using global fetch (available in Node 18+)
            fetch(EMAIL_SERVICE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.error('Failed to notify EmailService asynchronously:', err.message));

        } catch (error) {
            console.error('Failed to setup Welcome email trigger:', error.message);
        }
    }
}

module.exports = new UserService();
