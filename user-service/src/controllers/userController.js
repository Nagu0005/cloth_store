const userService = require('../services/userService');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
            }

            const result = await userService.registerUser({ name, email, password });
            res.status(201).json({ success: true, data: result.user, token: result.token });
        } catch (error) {
            if (error.message === 'Email already in use') {
                return res.status(409).json({ success: false, error: error.message });
            }
            res.status(500).json({ success: false, error: 'Registration failed', details: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Email and password are required' });
            }

            const result = await userService.loginUser(email, password);
            res.status(200).json({ success: true, data: result.user, token: result.token });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const user = await userService.verifyAndGetUser(token);

            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
        }
    }
}

module.exports = new UserController();
