<template>
  <div v-if="isVisible1" class="modal-backdrop">
    <div class="modal fade show" tabindex="-1" aria-hidden="false" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: solid 0.05em gray">
            <h5 class="modal-name">Cập nhật phòng ban</h5>
            <button type="button" class="btn-close" @click="closeForm" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="name" class="form-label d-flex text-start">Tên phòng ban:</label>
                <input type="text" id="name" v-model="department.name" class="form-control" @blur="validatename"
                  @input="clearServerError" :class="{ 'is-invalid': errors.name || serverErrors.name }" />
                <div class="invalid-feedback" v-if="errors.name || serverErrors.name">
                  {{ errors.name || serverErrors.name }}
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary me-2" :disabled="hasErrors" @click="updateDepartment">
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
import departmentsService from "@/services/DepartmentsService";
import { toast } from "vue3-toastify";

export default {
  props: {
    isVisible1: Boolean,
    departmentsData: Object,
  },
  data() {
    return {
      department: {
        id: null,
        name: "",
      },
      errors: {
        name: null,
        point: null,
      },
      serverErrors: {
        name: null,
      },
    };
  },
  computed: {
    hasErrors() {
      return (
        Object.values(this.errors).some((error) => error !== null) ||
        !!this.serverErrors.name
      );
    },
  },
  methods: {
    async updateDepartment() {
      if (this.hasErrors) {
        alert("Vui lòng sửa các lỗi trước khi cập nhật.");
        return;
      }

      try {
        await departmentsService.updateDepartments(
          this.department.id,
          this.department
        );
        toast.success("Cập nhật thành công!", {
          autoClose: 2000,
        });
        this.$emit("department-edited");
        this.closeForm();
      } catch (error) {
        console.error("Error updating department:", error);
        // Xử lý lỗi từ server (chỉ quan tâm đến name)
        if (error.response && error.response.data) {
          this.serverErrors.name = error.response.data.error || null;
        }
      }
    },
    validatename() {
      if (!this.department.name.trim()) {
        this.errors.name = "Tên tiêu chí không được để trống.";
      } else if (this.department.name.length < 3) {
        this.errors.name = "Tên tiêu chí phải dài ít nhất 3 ký tự.";
      } else {
        this.errors.name = null;
      }
    },
    clearServerError() {
      this.serverErrors.name = null;
    },
    closeForm() {
      this.$emit("close");
    },
  },
  watch: {
    departmentsData(newVal) {
      this.department = { ...newVal };
    },
  },
};
</script>

<style scoped>
.department-edit {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  max-height: 80%;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-in-out;
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
</style>