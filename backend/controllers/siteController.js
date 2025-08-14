const Site = require('../models/Site');

// Get all sites 
const getSites = async (req, res) => {
    try {
        const sites = await Site.find();
        res.json(sites);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error fetching reports' });
    }
};

// Get site by ID
const getSiteById = async (req, res) => {
    const { id } = req.params;

    try {
        const site = await Site.findById(id);

        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }

        res.json(site);
    } catch (error) {
        console.error('Error fetching site:', error);
        res.status(500).json({ message: 'Server error fetching site' });
    }
};






module.exports = {
    getSites,
    getSiteById

};
