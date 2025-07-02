import mongoose, { Schema } from 'mongoose';


const StudentAttendanceSchema = new Schema({
  studentId: {
    type: String, 
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  present: {
    type: Boolean,
    default: false,
  },
});


const AttendanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  students: [StudentAttendanceSchema],
}, { timestamps: true });


const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

export default Attendance;