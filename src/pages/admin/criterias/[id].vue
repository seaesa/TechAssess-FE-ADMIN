<template>
  <div class="criteria-detail">
    <div style="border-bottom: solid gray">
      <div class="d-flex align-items-center justify-content-between">
        <button class="btn btn-success me-3" type="button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="mt-2 text-center flex-grow-1">Chi tiết tiêu chí đánh giá</h2>
      </div>
    </div>
    <div class="content mt-4" style="height: 75vh; width: 100%">
      <h4><strong>Tiêu đề:</strong> {{ criteriaDetail.title }}</h4>
      <h4 class="mb-3"><strong>Số điểm:</strong> {{ criteriaDetail.point }}</h4>
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success me-3" type="button" @click="openAddQuestionModal">
          Thêm câu hỏi
        </button>
      </div>
      <div class="" style="height: 64vh; width: 100%;">
        <table v-if="criteriaDetail.questions && criteriaDetail.questions.length > 0"
          class="table table-hover table-bordered criteria-table">
          <thead>
            <tr>
              <th style="width: 30px">STT</th>
              <th>Câu hỏi</th>
              <th>Điểm</th>
              <th style="width: 250px">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in criteriaDetail.questions" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="text-start">{{ question.title }}</td>
              <td>{{ question.point }}</td>
              <td>
                <button class="btn btn-primary me-2" @click="openDetailModal(question)">
                  Chi tiết
                </button>
                <button class="btn btn-warning me-2" @click="openEditModal(question)">
                  Sửa
                </button>
                <button type="button" class="btn btn-danger" @click="confirmDeleteQuestion(question.id)">
                  Xoá
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Không có câu hỏi nào cho tiêu chí này.</p>
      </div>

      <div class="pagination-wrapper">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <DetailQuestionModal v-if="isDetailModalVisible" :isVisible="isDetailModalVisible" :question="selectedQuestion"
      @close="closeDetailModal" />

    <AddQuestionModal v-if="isAddQuestionModalVisible" :is-visible="isAddQuestionModalVisible"
      @close="closeAddQuestionModal" @question-added="refreshQuestions" />

    <EditQuestionModal v-if="isModalVisible" :isVisible="isModalVisible" :question="selectedQuestion"
      @close="closeEditModal" @question-updated="refreshQuestions" />
  </div>
</template>

<script>
import CriteriasService from "@/services/CriteriasService";
import EditQuestionModal from "./components/EditQuestionModal.vue";
import Swal from "sweetalert2";
import QuestionService from "@/services/QuestionService";
import { toast } from "vue3-toastify";
import AddQuestionModal from "./components/AddQuestionModal.vue";
import DetailQuestionModal from "./components/DetailQuestionModal.vue";

export default {
  components: {
    EditQuestionModal,
    AddQuestionModal,
    DetailQuestionModal,
  },
  data() {
    return {
      criteriaDetail: {
        title: "",
        point: 0,
        questions: [],
      },
      questionDetails: {
        title: "",
        point: 0,
        answers: [],
      },
      isDetailModalVisible: false,
      currentPage: 1,
      itemsPerPage: 10,
      isAddQuestionModalVisible: false,
      isModalVisible: false,
      selectedQuestion: null,
    };
  },
  computed: {
    totalPages() {
      if (
        this.criteriaDetail.questions &&
        Array.isArray(this.criteriaDetail.questions)
      ) {
        return Math.ceil(
          this.criteriaDetail.questions.length / this.itemsPerPage
        );
      }
      return 1;
    },
    paginatedCriterias() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.criteriaDetail.slice(start, end);
    },
  },
  async mounted() {
    await this.fetchCriteriaDetail();
  },
  methods: {
    async fetchCriteriaDetail() {
      const id = this.$route.params.id;
      const department_id = localStorage.getItem("selectedDepartmentId");

      try {
        const response = await CriteriasService.fetchCriteriasById(
          id,
          department_id
        );
        console.log(response);

        if (response.code == 1010) {
          this.criteriaDetail = response.data;
        } else {
          console.error("Lỗi khi lấy chi tiết tiêu chí:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    },

    async confirmDeleteQuestion(id) {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa câu hỏi này?",
        icon: "warning",
        showCancelButton: true,
      });
      if (result.isConfirmed) {
        try {
          const res = await QuestionService.deletedQuestion(id);
          if (res.status === 204) {
            toast.success("Xoá câu hỏi thành công!", {
              autoClose: 2000,
            });
            this.fetchCriteriaDetail();
          }
        } catch (error) {
          console.error("Lỗi khi xóa câu hỏi:", error);
          toast.error("Lỗi khi xóa câu hỏi");
        }
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    openDetailModal(question) {
      this.selectedQuestion = question;
      this.isDetailModalVisible = true;
    },

    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.selectedQuestion = null;
    },

    openAddQuestionModal() {
      this.isAddQuestionModalVisible = true;
    },
    closeAddQuestionModal() {
      this.isAddQuestionModalVisible = false;
    },
    openEditModal(question) {
      this.selectedQuestion = question;
      this.isModalVisible = true;
    },
    closeEditModal() {
      this.isModalVisible = false;
      this.selectedQuestion = null;
    },
    refreshQuestions() {
      this.fetchCriteriaDetail();
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.criteria-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  max-height: 1000vh;
  text-align: left;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.criteria-table th,
.criteria-table td {
  padding: 7px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.criteria-table th {
  background-color: #000066;
  color: white;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
}

.criteria-table tr:hover {
  background-color: #f9f9f9;
}

.criteria-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

.pagination-wrapper span {
  margin-top: 28px;
}

.pagination-btn {
  margin: 10px 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.fas {
  font-size: 1.7rem;
}
</style>
