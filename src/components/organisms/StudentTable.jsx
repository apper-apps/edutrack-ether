import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" className="h-4 w-4" />;
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="h-4 w-4" />
      : <ApperIcon name="ArrowDown" className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Student</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("gradeLevel")}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Grade</span>
                  <SortIcon field="gradeLevel" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("section")}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Section</span>
                  <SortIcon field="section" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("enrollmentDate")}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Enrollment</span>
                  <SortIcon field="enrollmentDate" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-gray-700">Status</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-gray-700">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student, index) => (
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
                  <span className="text-sm text-gray-900">{student.gradeLevel}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{student.section}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student.status === "active" ? "active" : "inactive"}>
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(student)}
                    >
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student.Id)}
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;