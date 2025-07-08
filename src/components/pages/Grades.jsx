import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import GradesTable from "@/components/organisms/GradesTable";
import Header from "@/components/organisms/Header";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";

const Grades = () => {
  const { setSidebarOpen } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    score: "",
    maxScore: "100",
    gradeType: "test",
    semester: "Fall 2024",
    date: new Date().toISOString().split('T')[0]
  });

  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Art"];
  const gradeTypes = ["test", "quiz", "assignment", "project", "exam"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      setStudents(studentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGrade = (student = null) => {
    setSelectedGrade(null);
    setSelectedStudent(student);
    setFormData({
      studentId: student ? student.Id : "",
      subject: "",
      score: "",
      maxScore: "100",
      gradeType: "test",
      semester: "Fall 2024",
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setSelectedStudent(null);
    setFormData({
      studentId: grade.studentId,
      subject: grade.subject,
      score: grade.score.toString(),
      maxScore: grade.maxScore.toString(),
      gradeType: grade.gradeType,
      semester: grade.semester,
      date: grade.date || new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;

    try {
      await gradeService.delete(gradeId);
      setGrades(prev => prev.filter(g => g.Id !== gradeId));
      toast.success("Grade deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete grade");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const gradeData = {
        ...formData,
        studentId: parseInt(formData.studentId),
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore)
      };

      if (selectedGrade) {
        await gradeService.update(selectedGrade.Id, gradeData);
        toast.success("Grade updated successfully!");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully!");
      }

      setShowForm(false);
      loadData();
    } catch (err) {
      toast.error("Failed to save grade");
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
          title="Grades"
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
          title="Grades"
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
        title="Grades"
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {students.length === 0 ? (
            <Empty
              title="No students found"
              message="You need to add students before you can manage grades."
              icon="GraduationCap"
            />
          ) : (
            <GradesTable
              students={students}
              grades={grades}
              onAddGrade={handleAddGrade}
              onEditGrade={handleEditGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Grade Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedGrade ? "Edit Grade" : "Add New Grade"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Student"
            name="studentId"
            type="select"
            value={formData.studentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Student</option>
            {students.map(student => (
<option key={student.Id} value={student.Id}>
                {student.Name} - Grade {student.gradeLevel}
              </option>
            ))}
          </FormField>

          <FormField
            label="Subject"
            name="subject"
            type="select"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Score"
              name="score"
              type="input"
              value={formData.score}
              onChange={handleChange}
              required
            />
            <FormField
              label="Max Score"
              name="maxScore"
              type="input"
              value={formData.maxScore}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Grade Type"
              name="gradeType"
              type="select"
              value={formData.gradeType}
              onChange={handleChange}
              required
            >
              {gradeTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </FormField>
            <FormField
              label="Semester"
              name="semester"
              type="select"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Summer 2024">Summer 2024</option>
            </FormField>
          </div>

          <FormField
            label="Date"
            name="date"
            type="input"
            value={formData.date}
            onChange={handleChange}
            required
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
              {selectedGrade ? "Update Grade" : "Add Grade"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;