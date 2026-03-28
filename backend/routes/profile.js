const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// POST /generate
// Protected route: User must be logged in to create a profile
router.post('/generate', authenticateToken, async (req, res) => {
    const { tiktok, instagram, telegram, facebook, X, phone, email } = req.body;
    const userId = req.user.id; // From JWT

    try {
        // Check if user already has a profile? Or allow multiple? 
        // Assuming 1 profile per user for now, or just creating a new one every time.
        // The requirement says "returns a unique profile_id", so we insert a new row.

        const [newProfile] = await db('social_profiles')
            .insert({
                user_id: userId,
                tiktok,
                instagram,
                telegram,
                facebook,
                X,
                phone,
                email
            })
            .returning('*');

        res.status(201).json({ profile_id: newProfile.id, profile: newProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

// GET /profile/:id
// Public route (used by QR scanner)
router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const profile = await db('social_profiles').where({ id }).first();

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
