import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      maxlength: [80, 'Task title cannot exceed 80 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters.'],
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    category: {
      type: String,
      trim: true,
      maxlength: [30, 'Category cannot exceed 30 characters.'],
      default: 'Personal',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, createdAt: -1 });

taskSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
  },
});

export default mongoose.model('Task', taskSchema);
