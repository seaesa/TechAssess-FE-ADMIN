<template>
  <!-- Modal Update Project -->
  <div class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cập nhật dự án</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Form nhập tên dự án và chọn bộ phận -->
          <form ref="projectForm" @submit.prevent="updateProject">
            <div class="mb-3 d-flex">
              <label for="project-name" class="col-form-label text-start w-50">Tên dự án:</label>
              <input type="text" class="form-control" id="name" v-model="editingProject.name" required />
            </div>
            <div class="mb-3 d-flex">
              <label for="project-start-date" class="col-form-label text-start w-50">Ngày bắt đầu:</label>
              <input type="date" class="form-control" id="startday" v-model="editingProject.startDay" :min="minDate"
                required />
            </div>
            <div class="mb-3 d-flex">
              <label for="project-end-date" class="col-form-label text-start w-50">Ngày kết thúc:</label>
              <input type="date" class="form-control" id="endDay" v-model="editingProject.endDay"
                :min="editingProject.startDay" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary" @click="updateProject">
            Cập nhật
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
  name: 'UpdateProject',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      apiUrl: import.meta.env.TECH__SERVER_URL,
      editingProject: {
        id: null,
        name: "",
        startDay: "",
        endDay: "",
        members: [],
      },
      minDate: "2023-01-01",
    };
  },
  watch: {
    project: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editingProject = this.cloneProject(newVal);
        }
      }
    }
  },
  methods: {
    cloneProject(project) {
      return {
        id: project.id,
        name: project.name || "",
        startDay: project.startDay || "",
        endDay: project.endDay || "",
        members: [...(project.members || [])],
      };
    },
    closeModal() {
      this.$emit('close');
      // Reset editing project khi đóng modal
      this.editingProject = { id: null, name: "", startDay: "", endDay: "", members: [] };
    },
    async updateProject() {
      const form = this.$refs.projectForm;
      if (form.reportValidity()) {
        if (!this.editingProject.id) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Dự án không hợp lệ. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'Đóng',
          });
          return;
        }

        const updatedProject = {
          name: this.editingProject.name,
          startDay: this.formatDate(this.editingProject.startDay),
          endDay: this.formatDate(this.editingProject.endDay),
        };

        console.log('Updated Project Data:', updatedProject); // In dữ liệu để kiểm tra

        try {
          const response = await axios.put(`${this.apiUrl}/api/projects/${this.editingProject.id}`, updatedProject);

          console.log('Response from server:', response.data); // In phản hồi từ server

          if (response.data && (response.data.code === 200 || response.status === 200)) {
            this.$emit('project-fetch');
            Swal.fire({
              title: 'Cập nhật dự án thành công!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            this.closeModal();
          } else if (response.data.code === 1013) {
            Swal.fire({
              title: 'Lỗi!',
              text: 'Có vấn đề với yêu cầu cập nhật: ' + response.data.message,
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
          } else {
            throw new Error('Unexpected response code: ' + response.data.code);
          }
        } catch (error) {
          console.error('Error updating project:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Có lỗi xảy ra khi cập nhật dự án: ' + (error.response.data.message || error.message),
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
          } else {
            console.error('Error message:', error.message);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Có lỗi xảy ra: ' + error.message,
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
          }
        }
      }
    }
    ,
    formatDate(date) {
      if (!date) return null;
      return date; // Có thể thêm logic định dạng nếu cần
    },
  },
}
</script>

<style scoped></style>
