<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal fade show" tabindex="-1" aria-hidden="false" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm mới câu hỏi</h5>
            <button class="btn-close" type="button" @click="closeForm" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-4">
                <label for="question-title" class="form-label d-flex text-start">Tên câu hỏi:</label>
                <input type="text" id="question-title" v-model="localQuestion.title" class="form-control"
                  :class="{ 'is-invalid': errors.title }" @blur="validateQuestion" />
                <div v-if="errors.title" class="invalid-feedback">
                  {{ errors.title }}
                </div>
              </div>
              <div class="mb-4">
                <label for="question-point" class="form-label d-flex text-start">Điểm câu hỏi:</label>
                <input type="number" id="question-point" v-model="localQuestion.point" class="form-control"
                  :class="{ 'is-invalid': errors.point }" @blur="validatePoint" />
                <div v-if="errors.point" class="invalid-feedback">
                  {{ errors.point }}
                </div>
              </div>
              <hr class="my-4" />
              <lable class="p-2 d-flex text-start">
                <h5>Mức độ câu trả lời</h5>
              </lable>
              <div v-for="(answer, answerIndex) in localQuestion.answers" :key="answer.id" class="form-group mb-3">
                <label :for="'answer-title-' + answer.id" class="form-label d-flex text-start">
                  Mức độ {{ answerIndex + 1 }}:
                </label>
                <input type="text" :id="'answer-title-' + answer.id" v-model="answer.title" class="form-control"
                  :class="{ 'is-invalid': errors['answer-' + answer.id] }" @blur="validateAnswer(answer)" />
                <div v-if="errors['answer-' + answer.id]" class="invalid-feedback">
                  {{ errors["answer-" + answer.id] }}
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div class="d-flex justify-content-end mt-5">
              <button type="submit" class="btn btn-primary me-2" :disabled="hasErrors || isSubmitting"
                @click="addQuestion">
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { toast } from "vue3-toastify";
export default {
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      localQuestion: {
        title: "",
        point: "",
        answers: [
          { id: Date.now(), title: "", value: "1" },
          { id: Date.now() + 1, title: "", value: "2" },
          { id: Date.now() + 2, title: "", value: "3" },
          { id: Date.now() + 3, title: "", value: "4" },
          { id: Date.now() + 4, title: "", value: "5" },
        ],
      },
      errors: {
        title: null,
        point: null,
      },
      isSubmitting: false,
    };
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== null);
    },
  },
  methods: {
    async addQuestion() {
      const depart_Id = localStorage.getItem("selectedDepartmentId");
      this.validateQuestion();
      this.validatePoint();
      this.localQuestion.answers.forEach((answer) =>
        this.validateAnswer(answer)
      );
      if (this.hasErrors) {
        toast.warning("Vui lòng sửa các lỗi trước khi lưu.");
        return;
      }
      const payload = {
        title: this.localQuestion.title,
        point: this.localQuestion.point,
        criteriaId: this.$route.params.id,
        answers: this.localQuestion.answers.map((answer) => ({
          title: answer.title,
          value: answer.value,
        })),
        departmentId: depart_Id,
      };

      try {
        await axios.post(import.meta.env.TECH__SERVER_URL + "/api/questions", payload);
        toast.success("Thêm câu hỏi thành công");
        this.$emit("question-added", payload);
        this.closeForm(); // Đóng form sau khi thêm câu hỏi
      } catch (error) {
        console.error("Lỗi khi thêm câu hỏi:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    validateQuestion() {
      // Kiểm tra tên câu hỏi
      this.errors.title = this.localQuestion.title.trim()
        ? null
        : "Tên câu hỏi không được để trống.";
    },
    validatePoint() {
      // Kiểm tra điểm câu hỏi
      this.errors.point =
        this.localQuestion.point > 0 ? null : "Điểm câu hỏi phải lớn hơn 0.";
    },
    validateAnswer(answer) {
      // Kiểm tra câu trả lời
      this.errors["answer-" + answer.id] = answer.title.trim()
        ? null
        : "Câu trả lời không được để trống.";
    },
    closeForm() {
      // Đóng form và reset dữ liệu câu hỏi
      this.$emit("close");
      this.resetForm();
    },
    resetForm() {
      // Reset lại form sau khi thêm câu hỏi
      this.localQuestion = {
        title: "",
        point: null,
        answers: [
          { id: Date.now(), title: "", value: "1" },
          { id: Date.now() + 1, title: "", value: "2" },
          { id: Date.now() + 2, title: "", value: "3" },
          { id: Date.now() + 3, title: "", value: "4" },
          { id: Date.now() + 4, title: "", value: "5" },
        ],
      };
      this.errors = {
        title: null,
        point: null,
      };
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
}
</style>
