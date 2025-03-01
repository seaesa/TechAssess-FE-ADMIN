import request from "@/utils/request";

const UserService = {
  fetchTeamsByUserId: async (userId, projectId) => {
    try {
      const response = await request.get(`/api/users/${userId}/same-project`, {
        params: {
          projectId,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  calculateWorkingTime: (startDate) => {
    const endDate = new Date();
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    return diffDays;
  },
  async uploadAvatar(user, formData) {
    try {
      // Gọi API PUT để upload avatar, sử dụng formData
      const response = await request.put(
        `/api/users/updateUserWithAvatar/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng Content-Type
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      console.error(error);
    }
  },
  fetchUserById: async (userId) => {
    try {
      const response = await request.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  addUser: async (dto) => {
    try {
      const response = await request.post("/api/auths/register", dto);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  deletedUser: async (id) => {
    try {
      const response = await request.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  fetchUsers: async () => {
    try {
      const response = await request.get("/api/users");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  fetchUserById: async (id) => {
    try {
      const response = await request.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  updateUser: async (reqDto, id) => {
    try {
      const response = await request.put(`/api/users/${id}`, reqDto);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default UserService;
