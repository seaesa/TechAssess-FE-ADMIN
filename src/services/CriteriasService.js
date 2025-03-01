import request from "@/utils/request";

const CriteriasService = {
  addCriteria: async (formData) => {
    const resp = await request.post("/api/criterias", formData);
    return resp.data;
  },

  deletedCriterias: async (id) => {
    try {
      const response = await request.delete(`/api/criterias/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  fetchCriterias: async () => {
    try {
      const response = await request.get("/api/criterias");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  fetchCriteriasById: async (id, department_id) => {
    try {
      const response = await request.get(
        `/api/criterias/${id}/${department_id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  updateCriterias: async (id, criteriaData) => {
    try {
      const updatedCriteria = {
        title: criteriaData.title,
        point: criteriaData.point,
      };

      const response = await request.put(
        `/api/criterias/${id}`,
        updatedCriteria
      );
      return response.data;
    } catch (error) {
      console.error("Error updating criteria:", error);
      throw error;
    }
  },
  updateCriteriaInDepartment: async (
    critediaId,
    departmentId,
    criteriaReqDto
  ) => {
    try {
      const dto = {
        criteriaReqDTO: {
          title: criteriaReqDto.title,
          visibleFor: criteriaReqDto.visibleFor,
        },
        criteriaId: critediaId,
        departmentId: departmentId,
      };

      const response = await request.put(
        `/api/criterias/update-criterion-in-department`,
        dto
      );
      return response.data;
    } catch (error) {
      console.error("Error updating criteria:", error);
      throw error;
    }
  },

  // department
  fetchDepartment: async () => {
    try {
      const response = await request.get("/api/departments");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default CriteriasService;
