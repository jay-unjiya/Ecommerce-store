const express = require('express');
const authCheck = require('../middleware/adminAuth');
const route = express.Router();

route.post('/verifyAccess', authCheck, (req, res) => {
    res.status(200).json({ message: 'Access Granted', success: true, id: req.user.id ,user:req.user});
});

route.post('/verifyAdminAccess', authCheck, (req, res) => {
    res.status(200).json({ message: 'Access Granted', success: true, id: req.user.id,user:req.user });
});
module.exports = route;
