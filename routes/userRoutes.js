const express = require('express');
const userController = require('../controllers/userController');
const router = require('express').Router();
const { verify } = require('../middlewares/verify');
    
router.post('/register', userController.registerUser);

router.get('/details', verify, userController.getUserDetails);

router.post('/login', userController.userLogin);

module.exports = router;