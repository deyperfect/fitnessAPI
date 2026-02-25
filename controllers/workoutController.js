const Workout = require('../models/Workout');

module.exports.addWorkout = (req, res) => {
	const { name, duration, status } = req.body;

    if (!name || !duration || !status) {
        return res.status(400).send({
            message: "All fields are required"
        });
    }

    let newWorkout = new Workout({
    	name,
    	duration,
    	status,
    	userId: req.user.id
    });

    return newWorkout.save()
    	.then(result => res.status(201).send(result))
        .catch(error => res.status(500).send({ error: "Error adding workout" }));
}

module.exports.getMyWorkouts = (req, res) => {
	const userId = req.user.id;

	return Workout.find({ userId })
	    .select("-__v")
	    .then(workouts => {
	      return res.status(200).send(workouts);
	    })
	    .catch(error => {
	      return res.status(500).send({
	        error: "Error fetching workouts"
	      });
    });
};


module.exports.updateWorkout = (req, res) => {
  const { id } = req.params;
  const { name, duration, status } = req.body;

  if (!name || !duration || !status) {
    return res.status(400).send({ error: "All fields are required" });
  }

  Workout.findByIdAndUpdate(
    id,
    { name, duration, status },
    { returnDocument: 'after', runValidators: true }
  )
    .then(updatedWorkout => {
      if (!updatedWorkout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      return res.status(200).send({
        success: true,
        message: "Workout updated successfully",
        workout: {
          id: updatedWorkout._id,
          name: updatedWorkout.name,
          duration: updatedWorkout.duration,
          status: updatedWorkout.status
        }
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        message: "Error updating workout",
        error: error
      });
    });
};


module.exports.deleteWorkout = (req, res) => {
  const { id } = req.params; 

  return Workout.findByIdAndDelete(id)
    .then(deletedWorkout => {
      if (!deletedWorkout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      return res.status(200).send({
        message: "Workout deleted successfully",
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({ error: "Error deleting workout", details: error });
    });
};

module.exports.completeWorkoutStatus = (req, res) => {
  const { id } = req.params;

  Workout.findById(id)
    .then(workout => {
      if (!workout) return res.status(404).send({ error: "Workout not found" });

      if (workout.status === "completed") {
        return res.status(400).send({ message: "Workout is already completed" });
      }

      return Workout.findByIdAndUpdate(
        id,
        { status: "completed" },
        { returnDocument: "after", runValidators: false }
      );
    })
    .then(updatedWorkout => {
      if (!updatedWorkout) return;

      return res.status(200).send({
        message: "Workout status updated successfully",
        workout: updatedWorkout
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        error: "Error updating workout status",
        details: error
      });
    });
};