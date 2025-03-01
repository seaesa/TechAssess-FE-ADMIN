<template>
  <div class="chart-container">
    <Radar v-if="hasData" :data="chartData" :options="chartOptions" />
    <div v-else class="no-data-message">Chưa có đánh giá</div>

    <div class="chart-legend" v-if="hasData">
      <div v-for="(item, index) in chartData.datasets" :key="index" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: item.backgroundColor }"></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Radar } from "vue-chartjs";
import { RadarController, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js";
import { Chart as ChartJS } from "chart.js";

ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler);

export default {
  name: "RadarChart",
  components: {
    Radar,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasData() {
      return (
        this.data.selfAssessment.length > 0 ||
        this.data.manager.length > 0 ||
        this.data.team.length > 0
      );
    },
  },
  data() {
    return {
      chartData: {
        labels: this.data.labels,
        datasets: [
          {
            label: "Tự đánh giá",
            data: this.data.selfAssessment,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Quản Lý",
            data: this.data.manager,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
          {
            label: "Team",
            data: this.data.team,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          r: {
            angleLines: {
              display: false,
            },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              stepSize: 1, // Đặt khoảng cách giữa các mốc là 1
            },
          },
        },
      },
    };
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  display: flex;
  width: 450px;
  flex-direction: column;
  justify-content: center; /* Centers the chart vertically */
}

.chart-legend {
  display: flex;
  justify-content: center; /* Center horizontally */
  gap: 20px; /* Space between legend items */
  position: absolute;
  bottom: 10px; /* Position from the bottom of the chart */
  left: 0;
  width: 100%;
  background: #fff; /* Optional: background to separate legend from chart */
  padding: 10px;
  border-top: 1px solid #ccc;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Optional: shadow for better visibility */
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.legend-label {
  display: inline;
}
.no-data-message {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  margin-bottom: 100px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
