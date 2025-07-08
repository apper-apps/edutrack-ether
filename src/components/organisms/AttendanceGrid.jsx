import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";

const AttendanceGrid = ({ students, attendance, onUpdateAttendance, selectedDate }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = monthDays.filter(day => !isWeekend(day));

  const getAttendanceStatus = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = attendance.find(a => 
      a.studentId === studentId && 
      format(new Date(a.date), "yyyy-MM-dd") === dateStr
    );
    return record ? record.status : null;
  };

  const updateAttendance = (studentId, date, status) => {
    const dateStr = format(date, "yyyy-MM-dd");
    onUpdateAttendance(studentId, dateStr, status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "absent": return "bg-red-500";
      case "late": return "bg-yellow-500";
      default: return "bg-gray-200";
    }
  };

  const getAttendancePercentage = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    const totalCount = studentAttendance.length;
    return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Attendance</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            >
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {format(selectedMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            >
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Student
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toString()}
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]"
                >
                  {format(day, "dd")}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
{student.Name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
<div className="text-sm font-medium text-gray-900">{student.Name}</div>
                      <div className="text-xs text-gray-500">Grade {student.gradeLevel}</div>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const status = getAttendanceStatus(student.Id, day);
                  const isPastDate = day < new Date();
                  return (
                    <td key={day.toString()} className="px-2 py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            if (isPastDate) return;
                            const newStatus = status === "present" ? "absent" : status === "absent" ? "late" : "present";
                            updateAttendance(student.Id, day, newStatus);
                          }}
                          disabled={!isPastDate && day.toDateString() !== new Date().toDateString()}
                          className={cn(
                            "w-6 h-6 rounded-full transition-colors",
                            getStatusColor(status),
                            isPastDate || day.toDateString() === new Date().toDateString() 
                              ? "cursor-pointer hover:opacity-80" 
                              : "cursor-not-allowed opacity-50"
                          )}
                        />
                      </div>
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-center">
                  <Badge variant={getAttendancePercentage(student.Id) >= 75 ? "success" : "warning"}>
                    {getAttendancePercentage(student.Id)}%
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Late</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;