import Task from '../models/Task.js';

const allowedFields = ['title', 'description', 'dueDate', 'priority', 'category', 'status'];

function pickTaskFields(body) {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      result[field] = body[field] === '' && field === 'dueDate' ? null : body[field];
    }
    return result;
  }, {});
}

export async function listTasks(req, res) {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ tasks });
}

export async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  return res.json({ task });
}

export async function createTask(req, res) {
  const values = pickTaskFields(req.body);
  if (!String(values.title || '').trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const task = await Task.create({ ...values, user: req.user.id });
  return res.status(201).json({ task });
}

export async function updateTask(req, res) {
  const values = pickTaskFields(req.body);
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    values,
    { new: true, runValidators: true },
  );

  if (!task) return res.status(404).json({ message: 'Task not found.' });
  return res.json({ task });
}

export async function updateTaskStatus(req, res) {
  if (!['Pending', 'Completed'].includes(req.body.status)) {
    return res.status(400).json({ message: 'Status must be Pending or Completed.' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: req.body.status },
    { new: true, runValidators: true },
  );

  if (!task) return res.status(404).json({ message: 'Task not found.' });
  return res.json({ task });
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  return res.status(204).send();
}
