import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const { setSidebarOpen } = useOutletContext();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "",
    section: "",
    capacity: "",
    teacherId: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getClassStudentCount = (classItem) => {
    return students.filter(s => 
      s.gradeLevel === classItem.gradeLevel && 
      s.section === classItem.section &&
      s.status === "active"
    ).length;
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setFormData({
      name: "",
      gradeLevel: "",
      section: "",
      capacity: "",
      teacherId: ""
    });
    setShowForm(true);
  };

const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.Name,
      gradeLevel: classItem.gradeLevel.toString(),
      section: classItem.section,
      capacity: classItem.capacity.toString(),
      teacherId: classItem.teacherId || ""
    });
    setShowForm(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await classService.delete(classId);
      setClasses(prev => prev.filter(c => c.Id !== classId));
      toast.success("Class deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const classData = {
        ...formData,
        gradeLevel: parseInt(formData.gradeLevel),
        capacity: parseInt(formData.capacity)
      };

      if (selectedClass) {
        await classService.update(selectedClass.Id, classData);
        toast.success("Class updated successfully!");
      } else {
        await classService.create(classData);
        toast.success("Class created successfully!");
      }

      setShowForm(false);
      loadData();
    } catch (err) {
      toast.error("Failed to save class");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Classes"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Classes"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header
        title="Classes"
        onMenuClick={() => setSidebarOpen(true)}
        actions={
          <Button onClick={handleAddClass}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {classes.length === 0 ? (
            <Empty
              title="No classes found"
              message="Get started by creating your first class."
              icon="BookOpen"
              action={handleAddClass}
              actionLabel="Add First Class"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem, index) => {
                const studentCount = getClassStudentCount(classItem);
                const occupancyRate = Math.round((studentCount / classItem.capacity) * 100);
                
                return (
                  <motion.div
                    key={classItem.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
                          </div>
                          <div>
<h3 className="font-semibold text-gray-900">{classItem.Name}</h3>
                            <p className="text-sm text-gray-600">
                              Grade {classItem.gradeLevel} - Section {classItem.section}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClass(classItem)}
                          >
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClass(classItem.Id)}
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Capacity</span>
                          <Badge variant={occupancyRate > 90 ? "error" : occupancyRate > 75 ? "warning" : "success"}>
                            {studentCount}/{classItem.capacity}
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Occupancy</span>
                          <span className="font-medium text-gray-900">{occupancyRate}%</span>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-600">
                            <ApperIcon name="User" className="h-4 w-4 mr-2" />
                            Teacher: {classItem.teacherId || "Not assigned"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Class Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedClass ? "Edit Class" : "Add New Class"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Grade Level"
              name="gradeLevel"
              type="select"
              value={formData.gradeLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select Grade</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </FormField>
            
            <FormField
              label="Section"
              name="section"
              type="select"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="">Select Section</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </FormField>
          </div>
          
          <FormField
            label="Capacity"
            name="capacity"
            type="input"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
          
          <FormField
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            placeholder="Enter teacher ID"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedClass ? "Update Class" : "Create Class"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;