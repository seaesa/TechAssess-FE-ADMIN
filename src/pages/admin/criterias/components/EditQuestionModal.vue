<template>
  <!-- Thêm lớp phủ -->
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal fade show" tabindex="-1" aria-hidden="false" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: solid 0.05em gray">
            <h5 class="modal-title">Cập nhật câu hỏi</h5>
            <button class="btn-close" type="button" @click="closeForm" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateQuestion">
              <!-- Câu hỏi -->
              <div class="mb-4">
                <label for="question-title" class="form-label d-flex text-start">Tên câu hỏi:</label>
                <input type="text" id="question-title" v-model="localQuestion.title" class="form-control"
                  :class="{ 'is-invalid': errors.title }" @blur="validateQuestion" />
                <div v-if="errors.title" class="invalid-feedback">
                  {{ errors.title }}
                </div>
              </div>

              <!-- Điểm câu hỏi -->
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
              <div v-for="(answer, answerIndex) in localQuestion.answers" :key="answer.id">
                <div class="form-group">
                  <label :for="'answer-title-' + answer.id" class="form-label d-flex text-start">Câu trả lời {{
                    answerIndex + 1 }}:</label>
                  <input type="text" :id="'answer-title-' + answer.id" v-model="answer.title" class="form-control"
                    :class="{ 'is-invalid': errors['answer-' + answer.id] }" @blur="validateAnswer(answer)" />
                  <div v-if="errors['answer-' + answer.id]" class="invalid-feedback">
                    {{ errors["answer-" + answer.id] }}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div class="d-flex justify-content-end mt-5">
              <button type="submit" class="btn btn-primary me-2" :disabled="hasErrors" @click="updateQuestion">
                Cập nhật
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
    question: Object,
  },
  data() {
    return {
      localQuestion: JSON.parse(JSON.stringify(this.question)),
      errors: {
        title: null,
        point: null,
      },
    };
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== null);
    },
  },
  methods: {
    async updateQuestion() {
      if (this.hasErrors) {
        toast.warn("Vui lòng sửa các lỗi trước khi cập nhật.");
        return;
      }

      const payload = {
        id: this.localQuestion.id,
        title: this.localQuestion.title,
        point: this.localQuestion.point,
        answers: this.localQuestion.answers.map((answer) => ({
          id: answer.id,
          title: answer.title,
          value: answer.value, // giữ nguyên giá trị value
        })),
      };

      try {
        await axios.put(
          import.meta.env.TECH__SERVER_URL + `/api/questions/${this.localQuestion.id}`,
          payload
        );
        this.$emit("question-updated", payload);
        toast.success("Cập nhật câu hỏi thành công!", {
          autoClose: 2000,
        });
        this.closeForm();
      } catch (error) {
        toast.error("Cập nhật không thành công");
      }
    },
    validateQuestion() {
      this.errors.title = this.localQuestion.title.trim()
        ? null
        : "Tên câu hỏi không được để trống.";
    },
    validatePoint() {
      this.errors.point =
        this.localQuestion.point > 0 ? null : "Điểm câu hỏi phải lớn hơn 0.";
    },
    validateAnswer(answer) {
      this.errors["answer-" + answer.id] = answer.title.trim()
        ? null
        : "Câu trả lời không được để trống.";
    },
    closeForm() {
      this.$emit("close");
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
