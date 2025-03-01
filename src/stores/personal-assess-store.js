import request from "@/utils/request";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePersonalAssessStore = defineStore("personal", () => {
  const data = ref([]);

  const getData = computed((state) => state.data);

  const getPersonalAssessByProject = async (projectId) => {
    const response = await request.get(`/api/departments/${projectId}`);
    return response.data;
  };
  return { data, getData, getPersonalAssessByProject };
});
