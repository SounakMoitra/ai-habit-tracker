import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    completedDate: {
      // date format -> YYYY-MM-DD
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Compound Unique Index in mongodb
//  - makes sure no two items have the same combo of userId, habitId and completedDate
//  - optimized query performance
habitLogSchema.index(
  { userId: 1, habitId: 1, completedDate: 1 },
  { unique: true },
);

export default mongoose.model("HabitLog", habitLogSchema);
