const express = require('express');
const router = express.Router();
const Train = require('../models/train');



router.post('/', apiKeyAuthenticate, async (req, res) => { 
   
    const { train_number, source_station, destination_station, total_seats } = req.body;
    try {
        await Train.create(train_number, source_station, destination_station, total_seats);
        res.status(201).json({ message: 'Train added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/availability', async (req, res) => {
    const { source, destination } = req.query;
    try {
        const trains = await Train.findAll(source, destination);
        res.json(trains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;