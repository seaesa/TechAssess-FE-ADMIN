<template>
  <div class="chart-container">
    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="noData" class="message no-data">
      Chưa có đánh giá nào cho người dùng này.
    </div>
    <canvas v-else ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import RatedRankService from "@/services/RatedRankService";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController
);

const route = useRoute();
const chartCanvas = ref(null);
const chart = ref(null);
const loading = ref(true);
const error = ref(null);
const noData = ref(false);
const chartData = reactive({
  labels: [],
  datasets: [],
});

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    noData.value = false;

    const response = await RatedRankService.fetchOverallRated(
      route.params.userId
    );
    if (response.code === 1010 && response.data) {
      const { overallOfCriteria } = response.data;

      if (overallOfCriteria && overallOfCriteria.length > 0) {
        // Lọc các tiêu chí có giá trị tất cả bằng 0
        const filteredCriteria = overallOfCriteria.filter(
          (criteria) =>
            criteria.selfPoint !== 0 ||
            criteria.teamPoint !== 0 ||
            criteria.managerPoint !== 0
        );

        if (filteredCriteria.length > 0) {
          chartData.labels = filteredCriteria.map(
            (criteria) => criteria.criteriaTitle
          );
          chartData.datasets = [
            {
              label: "Tự đánh giá",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgb(54, 162, 235)",
              pointBackgroundColor: "rgb(54, 162, 235)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(54, 162, 235)",
              data: filteredCriteria.map((criteria) => criteria.selfPoint),
            },
            {
              label: "Đánh giá của Team",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgb(255, 99, 132)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
              data: filteredCriteria.map((criteria) => criteria.teamPoint),
            },
            {
              label: "Đánh giá của Quản lý",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgb(255, 165, 0)",
              pointBackgroundColor: "rgb(255, 165, 0)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 165, 0)",
              data: filteredCriteria.map((criteria) => criteria.managerPoint),
            },
          ];
        } else {
          noData.value = true; // Không có dữ liệu sau khi lọc
        }
      } else {
        noData.value = true;
      }
    } else {
      throw new Error("Phản hồi API không hợp lệ");
    }
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu:", err);
    if (err.response && err.response.status === 400) {
      noData.value = true;
    } else {
      error.value = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
    }
  } finally {
    loading.value = false;
  }
};


const createChart = () => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext("2d");
    chart.value = new Chart(ctx, {
      type: "radar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            padding: 10,
            labels: {
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#333",
              padding: 25,
            },
          },
          title: {
            display: true,
            text: "Đánh Giá 360°",
            font: {
              size: 24,
              weight: "bold",
            },
            padding: {
              top: 20,
              bottom: 40,
            },
          },
          tooltip: {
            bodyFont: {
              size: 14,
            },
            titleFont: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              beginAtZero: true,
              font: {
                size: 14,
                weight: "bold",
              },
              z: 2,
            },
            pointLabels: {
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#333",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    });
  }
};

onMounted(async () => {
  await fetchData();
  if (!error.value && !noData.value) {
    createChart();
  }
});

watch(
  () => route.params.userId,
  async (newUserId) => {
    if (newUserId) {
      await fetchData();
      if (!error.value && !noData.value && chart.value) {
        chart.value.data = chartData;
        chart.value.update();
      } else if (chart.value) {
        chart.value.destroy();
        chart.value = null;
      }
    }
  }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1200px;
  height: 800px;
  margin: 0 auto;
  position: relative;
}

.message {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 20px;
}

.loading {
  top: 50%;
  transform: translate(-50%, -50%);
}

.error { 
  color: #ff4d4d;
}

.no-data {
  top: 40px;
  color: #666;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>