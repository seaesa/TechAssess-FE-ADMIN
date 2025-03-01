import ApiResponse from "@/model/ApiResponse";
import request from "@/utils/request";

const RatedRankService = {
  fetchOverallRated: async (userId) => {
    try {
      const response = await request.get("/api/rated-rank/overall-rated/" + userId);
      /**
       * @type {ApiResponse}
       */
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
export default RatedRankService;
