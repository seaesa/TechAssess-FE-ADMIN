<template>
    <div style="border-bottom: solid gray;">
        <h2 style="text-align: center">Quản lý ngày đánh giá</h2>
    </div>
    <div class="p-5">
        <div>
            <h4 style="text-align: center">Sắp xếp ngày đánh giá</h4>
            <i>Vui lòng chọn bộ phận trước khi sắp xếp lịch đánh giá!</i>
            <select class="form-select mt-2" aria-label="Default select example" @change="handleSelectChange">
                <option value="" selected>Chọn bộ phận</option>
                <option v-for="(item, index) in DataTest" :key="index" :value="item.department">
                    {{ item.department }}
                </option>
            </select>
        </div>
        <div class="form-container" v-if="selectedDepartment">
            <form class="form-date" @submit.prevent="submitForm" ref="evaluationForm">
                <h5 class="p-2" style="border-bottom: solid 0.1em;">Lịch đánh giá</h5>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="startDate">Từ ngày:</label>
                        <input type="date" class="form-control" id="startDate" v-model="formData.startDate" :disabled="formDisabled" :class="{ 'is-invalid': showError && !formData.startDate }">
                        <span v-if="showError && !formData.startDate" class="text-danger">Vui lòng chọn ngày bắt đầu!</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="endDate">Đến ngày:</label>
                        <input type="date" class="form-control" id="endDate" v-model="formData.endDate" :disabled="formDisabled" :class="{ 'is-invalid': showError && !formData.endDate }">
                        <span v-if="showError && !formData.endDate" class="text-danger">Vui lòng chọn ngày kết thúc!</span>
                        <span v-if="showError2 && formData.endDate <= formData.startDate" class="text-danger">Ngày kết thúc phải sau ngày bắt đầu!</span>                </div>
                </div>
                <div class="mb-3">
                    <label for="endDate">Ngày thông báo kết quả:</label>
                    <input type="date" class="form-control" id="endDate" v-model="formData.resultDate" :disabled="formDisabled" :class="{ 'is-invalid': showError && !formData.resultDate }">
                    <span v-if="showError && !formData.resultDate" class="text-danger">Vui lòng chọn ngày thông báo kết quả!</span>
                    <span v-if="showError2 && formData.resultDate <= formData.endDate" class="text-danger">Ngày thông báo kết quả phải sau ngày kết thúc!</span>
                </div>
                <button type="submit" class="btn btn-primary" v-if="!formSubmitted && !hiddenButton">Xác nhận</button>
            </form>
        </div>
        <i style="color: red;" v-if="formSubmitted">Bạn đã xác nhận thời gian cho bộ phận {{ selectedDepartment }} vào lúc {{ confirmationTimes[selectedDepartment] }}</i>
        <div v-if="isVisible" class="modal-backdrop">
            <div class="modal fade show" tabindex="-1" aria-hidden="false" style="display: block;">
                <div class="modal-dialog " style="display: block;">
                    <div class="modal-content">
                <div class="modal-header">
                    <h5>Xác nhận thông tin</h5>
                </div>
                <div class="modal-body">
                    <p>Bộ phận: {{ selectedDepartment }}</p>
                    <p>Ngày bắt đầu: {{ formData.startDate }}</p>
                    <p>Ngày kết thúc: {{ formData.endDate }}</p>
                    <p>Ngày thông báo kết quả: {{ formData.resultDate }}</p>
                </div>
                <div class="modal-footer d-flex ">
                    <p class="me-auto">Bạn có chắc chắn muốn xác nhận?</p>
                    <button class="btn btn-primary" @click="accept">Xác nhận</button>
                    <button class="btn btn-secondary" @click="resetFormData; isVisible = false">Hủy</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    </div> 
    <div class="">
        <h4 style="text-align: center">Danh sách bộ phân và ngày đánh giá</h4>
        <div class="table-responsive-md mt-2">
        <table class="table table-hover table-bordered employee-table">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Bộ phận</th>
                    <th scope="col">Trạng thái</th>
                </tr>   
            </thead>
            <tbody>
                <tr v-for="(item, index) in DataTest" :key="index">
                    <td>{{ item.ID }}</td>
                    <td>{{ item.department }}</td>
                    <td>{{ item.state }}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false,
            DataTest: [
                {ID:'1', department: 'abc', state: 'Chưa sắp xếp thời gian đánh giá' },
                {ID:'2', department: 'xyz', state: 'Chưa sắp xếp thời gian đánh giá' }
            ],
            selectedDepartment: '',
            formData: {
                startDate: '',
                endDate: '',
                resultDate: ''
            },
            savedFormData: {},
            formSubmitted: false, 
            formDisabled: false, 
            formDisabledStatus: {}, 
            isEditing: false,
            confirmationTimes: {}, 
            showError: false, 
            showError2: false, 
            hiddenButton: false,
        };
    },
    methods: {
        handleSelectChange(event) {
            if (this.selectedDepartment) {
                this.savedFormData[this.selectedDepartment] = { ...this.formData };
            }
            this.selectedDepartment = event.target.value;
            this.resetFormData();
            if (this.formDisabledStatus[this.selectedDepartment]) {
                this.formDisabled = this.formDisabledStatus[this.selectedDepartment];
                this.formSubmitted = true;
                this.hiddenButton = true;
            }
            if (this.savedFormData[this.selectedDepartment]) {
                this.formData = { ...this.savedFormData[this.selectedDepartment] };
            }
            
        },
        resetFormData() {
            this.formData = {
                startDate: '',
                endDate: '',
                resultDate: ''
            };
            this.formSubmitted = false;
            this.formDisabled = false;
            this.hiddenButton = false;
            this.showError = false;
        },
        showModal() {
            this.isVisible = true;
        },
        validateDates() {
            const { startDate, endDate, resultDate } = this.formData;
            if (!startDate || !endDate || !resultDate) {
                this.showError = true;
                return false;
            }
            if (new Date(resultDate) <= new Date(endDate) || new Date(endDate) <= new Date(startDate)) {
                this.showError2 = true;
                return false;
            }
            this.showError = false;
            this.showError2 = false;
            return true;
        },
        submitForm() {
            const validate = this.validateDates();
            if (validate) {
                this.showModal();
            }
        },
        accept() {
            this.formSubmitted = true;
            this.formDisabled = true;
            this.hiddenButton = true;
            this.confirmationTimes[this.selectedDepartment] = new Date().toLocaleString();
            this.formDisabledStatus[this.selectedDepartment] = true; // Lưu trạng thái disable của form
            this.savedFormData[this.selectedDepartment] = { ...this.formData }; // Lưu trữ dữ liệu form
            // Cập nhật trạng thái của mục trong DataTest
            const departmentIndex = this.DataTest.findIndex(item => item.department === this.selectedDepartment);
            if (departmentIndex !== -1) {
                this.DataTest[departmentIndex].state = 'Đã sắp xếp thời gian đánh giá';
            }
            this.isVisible = false;
        },
        editForm() {
            this.formDisabled = false;
            this.hiddenButton = false;
            this.formDisabledStatus[this.selectedDepartment] = false; // Cập nhật trạng thái disable của form
        }
    }
};
</script>


<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu nền đen với độ mờ 50% */
    z-index: 1040; /* Đảm bảo modal-backdrop nằm phía trên các phần tử khác */
}

.form-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    height: fit-content;
}
.form-date{
    width: 70%;
    background-color: rgb(183, 213, 236);
    border: solid grey 0.1em;
    border-radius: 10px;
    padding: 20px;
}
.text-danger {
    color: red;
}
.is-invalid {
    border-color: red;
}
</style>
