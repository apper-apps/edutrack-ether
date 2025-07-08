import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { studentService } from "@/services/api/studentService";

const StudentForm = ({ student, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gradeLevel: "",
    section: "",
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: "active"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
name: student.Name || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel || "",
        section: student.section || "",
        enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: student.status || "active"
      });
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (student) {
        await studentService.update(student.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student created successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <FormField
        label="Email"
        name="email"
        type="input"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <FormField
        label="Phone"
        name="phone"
        value={formData.phone}
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
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
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
        label="Enrollment Date"
        name="enrollmentDate"
        type="input"
        value={formData.enrollmentDate}
        onChange={handleChange}
        required
      />
      
      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </FormField>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : student ? "Update Student" : "Create Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;