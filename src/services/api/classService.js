import { toast } from "react-toastify";

class ClassService {
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
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "capacity" } },
          { field: { Name: "teacherId" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('class', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "capacity" } },
          { field: { Name: "teacherId" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('class', id, params);
      
      if (!response || !response.data) {
        throw new Error("Class not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching class with ID ${id}:`, error);
      throw error;
    }
  }

  async create(classData) {
    try {
      const params = {
        records: [
          {
            Name: classData.name,
            gradeLevel: parseInt(classData.gradeLevel),
            section: classData.section,
            capacity: parseInt(classData.capacity),
            teacherId: classData.teacherId
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('class', params);
      
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
      console.error("Error creating class:", error);
      throw error;
    }
  }

  async update(id, classData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: classData.name,
            gradeLevel: parseInt(classData.gradeLevel),
            section: classData.section,
            capacity: parseInt(classData.capacity),
            teacherId: classData.teacherId
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord('class', params);
      
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
      console.error("Error updating class:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('class', params);
      
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
          
          throw new Error("Failed to delete class");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }
}

export const classService = new ClassService();