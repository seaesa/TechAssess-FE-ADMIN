<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div
      class="modal fade show"
      tabindex="-1"
      aria-hidden="false"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết câu hỏi</h5>
            <button
              class="btn-close"
              type="button"
              @click="closeForm"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-4">
                <label for="question-title" class="form-label d-flex text-start"
                  >Tên câu hỏi:</label
                >
                <input
                  type="text"
                  id="question-title"
                  v-model="localQuestion.title"
                  class="form-control"
                  disabled
                />
              </div>
              <div class="mb-4">
                <label for="question-point" class="form-label d-flex text-start"
                  >Điểm câu hỏi:</label
                >
                <input
                  type="number"
                  id="question-point"
                  v-model="localQuestion.point"
                  class="form-control"
                  disabled
                />
              </div>
              <hr class="my-4" />
              <lable class="p-2 d-flex text-start">
                <h5>Mức độ câu trả lời</h5>
              </lable>
              <div
                v-for="(answer, answerIndex) in localQuestion.answers"
                :key="answer.id"
              >
                <div class="form-group">
                  <label
                    :for="'answer-title-' + answer.id"
                    class="form-label d-flex text-start"
                    >Mức độ {{ answerIndex + 1 }}:</label
                  >
                  <input
                    type="text"
                    :id="'answer-title-' + answer.id"
                    v-model="answer.title"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isVisible: Boolean,
    question: Object,
  },
  data() {
    return {
      localQuestion: JSON.parse(JSON.stringify(this.question)),
    };
  },
  methods: {
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
</style>
