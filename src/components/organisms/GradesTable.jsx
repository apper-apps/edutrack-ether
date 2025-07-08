import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const GradesTable = ({ students, grades, onAddGrade, onEditGrade, onDeleteGrade }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("all");

  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Art"];

  const getStudentGrades = (studentId) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getGradeAverage = (studentId) => {
    const studentGrades = getStudentGrades(studentId);
    if (studentGrades.length === 0) return 0;
    const total = studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return Math.round(total / studentGrades.length);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const filteredStudents = selectedSubject === "all" 
    ? students 
    : students.filter(student => 
        getStudentGrades(student.Id).some(grade => grade.subject === selectedSubject)
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <Button onClick={() => onAddGrade()}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Grade</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Average</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Recent Grades</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student, index) => {
                const studentGrades = getStudentGrades(student.Id);
                const average = getGradeAverage(student.Id);
                const recentGrades = studentGrades.slice(-3);

                return (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
{student.Name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
<div className="text-sm font-medium text-gray-900">{student.Name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">Grade {student.gradeLevel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getGradeColor(average)}>
                        {average}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {recentGrades.map((grade, i) => (
                          <div
                            key={i}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                          >
                            {grade.subject}: {Math.round((grade.score / grade.maxScore) * 100)}%
                          </div>
                        ))}
                        {recentGrades.length === 0 && (
                          <span className="text-sm text-gray-500">No grades yet</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddGrade(student)}
                        >
                          <ApperIcon name="Plus" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <ApperIcon name="Eye" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedStudent.name} - Detailed Grades
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStudent(null)}
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getStudentGrades(selectedStudent.Id).map((grade, index) => (
              <motion.div
                key={grade.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{grade.subject}</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditGrade(grade)}
                    >
                      <ApperIcon name="Edit" className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteGrade(grade.Id)}
                    >
                      <ApperIcon name="Trash2" className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {grade.score}/{grade.maxScore}
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((grade.score / grade.maxScore) * 100)}% • {grade.gradeType}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesTable;