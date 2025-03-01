import request from "@/utils/request";

const DepartmentsService = {
  // department
  fetchDepartment: async () => {
    try {
      const response = await request.get("/api/departments");
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  addDepartment: async (formData) => {
    const resp = await request.post("/api/departments", formData);
    return resp.data;
  },

  fetchDepartmentById: async (id) => {
    try {
      const response = await request.get(`/api/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  updateDepartments: async (id, departmentData) => {
    try {
      const updateDepartments = {
        name: departmentData.name,
      };

      const response = await request.put(`/api/departments/${id}`, updateDepartments);
      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  },

  deletedDepartments: async (id) => {
    console.log("id ", id);
    try {
      const response = await request.delete(`/api/departments/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default DepartmentsService;
