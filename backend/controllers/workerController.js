const Worker = require('../models/Worker');

// Get all workers
const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().sort({ lastName: 1, firstName: 1 });
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ message: 'Server error fetching workers' });
    }
};

// Get worker by ID
const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (error) {
        console.error('Error fetching worker:', error);
        res.status(500).json({ message: 'Server error fetching worker' });
    }
};



module.exports = {
    getWorkers,
    getWorkerById,
};
