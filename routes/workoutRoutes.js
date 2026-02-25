const express = require('express');
const workoutController = require('../controllers/workoutController');
const router = require('express').Router();
const { verify } = require('../middlewares/verify');
    
router.post('/addWorkout', verify, workoutController.addWorkout);

router.get('/getMyWorkouts', verify, workoutController.getMyWorkouts);

router.patch('/updateWorkout/:id', verify, workoutController.updateWorkout);

router.delete('/deleteWorkout/:id', verify, workoutController.deleteWorkout);

router.patch('/completeWorkoutStatus/:id', verify, workoutController.completeWorkoutStatus);

module.exports = router;