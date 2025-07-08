import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const { setSidebarOpen } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchQuery) {
      filtered = filtered.filter(student =>
student.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(student => student.gradeLevel === parseInt(gradeFilter));
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, gradeFilter, statusFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.Id !== studentId));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedStudent(null);
    loadStudents();
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Students"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Loading variant="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Students"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadStudents} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header
        title="Students"
        searchPlaceholder="Search students..."
        onSearch={handleSearch}
        onMenuClick={() => setSidebarOpen(true)}
        actions={
          <Button onClick={handleAddStudent}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Grade:</label>
              <Select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Grades</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">
                {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </div>

          {/* Students Table */}
          {filteredStudents.length === 0 ? (
            <Empty
              title="No students found"
              message="No students match your current search and filter criteria."
              icon="Users"
              action={handleAddStudent}
              actionLabel="Add First Student"
            />
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              onView={handleViewStudent}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedStudent(null);
        }}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        className="max-w-2xl"
      >
        <StudentForm
          student={selectedStudent}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedStudent(null);
          }}
        />
      </Modal>

      {/* Student Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
        className="max-w-2xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
{selectedStudent.Name.charAt(0)}
                </span>
              </div>
              <div>
<h3 className="text-lg font-semibold text-gray-900">{selectedStudent.Name}</h3>
                <p className="text-gray-600">{selectedStudent.email}</p>
                <Badge variant={selectedStudent.status === "active" ? "active" : "inactive"}>
                  {selectedStudent.status}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{selectedStudent.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <p className="text-sm text-gray-900">Grade {selectedStudent.gradeLevel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <p className="text-sm text-gray-900">{selectedStudent.section}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedStudent(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowDetails(false);
                  handleEditStudent(selectedStudent);
                }}
              >
                Edit Student
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;