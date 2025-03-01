<template>
  <!-- Modal Add Project -->
  <div class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Thêm mới dự án</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Form nhập tên dự án và chọn bộ phận -->
          <form ref="projectForm" @submit.prevent="submitForm">
            <div class="mb-3 d-flex">
              <label for="project-name" class="col-form-label text-start w-50 ">Tên dự án:</label>
              <input type="text" class="form-control" id="project-name" v-model="project.name" />
            </div>
            <div class="mb-3 d-flex">
              <label for="project-start-date" class="col-form-label text-start w-50">Ngày bắt đầu:</label>
              <input type="date" class="form-control" id="project-start-date" v-model="project.startDate"
                :min="minDate" />
            </div>
            <div class="mb-3 d-flex">
              <label for="project-start-date" class="col-form-label text-start w-50">Ngày kết
                thúc:</label>
              <input type="date" class="form-control" id="project-end-date" v-model="project.endDate" :min="minDate" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type=" submit" class="btn btn-primary" @click="addProject">
            Thêm dự án
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'AddProject',
  data() {
    return {
      apiUrl: import.meta.env.TECH__SERVER_URL,
      isModalVisible: false,
      project: {
        name: "",
        startDate: "",
        endDate: "",
        members: [],
      },
      minDate: "2023-01-01",
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.$emit('close');
    },
    async addProject() {
      const form = this.$refs.projectForm;
      if (form.reportValidity()) {
        const newProject = {
          name: this.project.name,
          startDay: this.formatDate(this.project.startDate),
          endDay: this.formatDate(this.project.endDate),
          departmentId: 1
        };
        try {
          const response = await axios.post(this.apiUrl + '/api/projects/add', newProject);
          if (response.data && response.data.code === 201) {
            this.$emit('project-fetch');
            Swal.fire({
              title: 'Thêm dự án thành công!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            this.resetForm();
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          } else {
            throw new Error('Unexpected response');
          }
        } catch (error) {
          console.error('Error adding project:', error);
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi thêm dự án: ' + (error.response?.data?.message || error.message),
            icon: 'error',
            confirmButtonText: 'Đóng',
          });
        }
      }
    },
    formatDate(date) {
      if (!date) return null;
      return date;
    },
    resetForm() {
      this.project = {
        name: "",
        startDay: "",
        endDay: "",
        members: [],
      };
    },
  },
}
</script>

<style scoped></style>