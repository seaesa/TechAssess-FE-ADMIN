import request from "@/utils/request";

const QuestionService = {
  addQuestion: async (formData) => {
    const resp = await request.post("/api/questions", formData);
    return resp.data;
  },

  deletedQuestion: async (id) => {
    try {
      const response = await request.delete(`/api/questions/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  getQuestionById: async (id) => {
    try {
      const response = await request.get(`/api/questions/v2/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default QuestionService;
