import { toast } from "react-toastify";

class GradeService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "score" } },
          { field: { Name: "maxScore" } },
          { field: { Name: "gradeType" } },
          { field: { Name: "semester" } },
          { field: { Name: "date" } },
          { field: { Name: "studentId" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "score" } },
          { field: { Name: "maxScore" } },
          { field: { Name: "gradeType" } },
          { field: { Name: "semester" } },
          { field: { Name: "date" } },
          { field: { Name: "studentId" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('grade', id, params);
      
      if (!response || !response.data) {
        throw new Error("Grade not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error);
      throw error;
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [
          {
            Name: `${gradeData.subject} - ${gradeData.gradeType}`,
            subject: gradeData.subject,
            score: parseFloat(gradeData.score),
            maxScore: parseFloat(gradeData.maxScore),
            gradeType: gradeData.gradeType,
            semester: gradeData.semester,
            date: gradeData.date,
            studentId: parseInt(gradeData.studentId)
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating grade:", error);
      throw error;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: `${gradeData.subject} - ${gradeData.gradeType}`,
            subject: gradeData.subject,
            score: parseFloat(gradeData.score),
            maxScore: parseFloat(gradeData.maxScore),
            gradeType: gradeData.gradeType,
            semester: gradeData.semester,
            date: gradeData.date,
            studentId: parseInt(gradeData.studentId)
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          throw new Error("Failed to delete grade");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw error;
    }
  }
}

export const gradeService = new GradeService();