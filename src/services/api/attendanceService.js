import { toast } from "react-toastify";

class AttendanceService {
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
          { field: { Name: "studentId" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "studentId" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('attendance', id, params);
      
      if (!response || !response.data) {
        throw new Error("Attendance record not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      throw error;
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [
          {
            Name: `Attendance - ${attendanceData.date}`,
            studentId: parseInt(attendanceData.studentId),
            date: attendanceData.date,
            status: attendanceData.status,
            reason: attendanceData.reason || ""
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('attendance', params);
      
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
      console.error("Error creating attendance:", error);
      throw error;
    }
  }

  async update(id, attendanceData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: `Attendance - ${attendanceData.date}`,
            studentId: parseInt(attendanceData.studentId),
            date: attendanceData.date,
            status: attendanceData.status,
            reason: attendanceData.reason || ""
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord('attendance', params);
      
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
      console.error("Error updating attendance:", error);
      throw error;
    }
  }

  async updateByStudentAndDate(studentId, date, status, reason = "") {
    try {
      // First check if record exists
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "studentId" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [studentId]
          },
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };
      
      const existingResponse = await this.apperClient.fetchRecords('attendance', params);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        const existingRecord = existingResponse.data[0];
        return await this.update(existingRecord.Id, {
          studentId,
          date,
          status,
          reason
        });
      } else {
        // Create new record
        return await this.create({
          studentId,
          date,
          status,
          reason
        });
      }
    } catch (error) {
      console.error("Error updating attendance by student and date:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('attendance', params);
      
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
          
          throw new Error("Failed to delete attendance record");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();