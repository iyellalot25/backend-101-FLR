// Validate POST /tasks request
function validateCreateTask(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  next();
}

// Validate PUT /tasks/:id request
function validateUpdateTask(req, res, next) {
  const { title, done } = req.body;

  // Nothing to update
  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Nothing to update",
    });
  }

  // Invalid title
  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res.status(400).json({
      error: "Invalid title",
    });
  }

  // Invalid done value
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      error: "Done must be true or false",
    });
  }

  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};
