<script>
import { Line } from "vue-chartjs";

import gql from "graphql-tag";
import Vue from "vue";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";

export default {
  extends: Line,
  data() {
    return {
      hardLimit: 5000,
      start: 0,
      limit: 100,
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperatura ºC",
            data: [],
            borderColor: "#f00",
            yAxisID: "temp-y-axis",
          },
          {
            label: "Humedad %",
            data: [],
            borderColor: "#00f",
            yAxisID: "hum-y-axis",
          },
        ],
      },
    };
  },
  apollo: {
    climas: {
      query: gql`
        query climas($limit: Int!, $start: Int!) {
          climasConnection(
            sort: "created_at:DESC"
            limit: $limit
            start: $start
          ) {
            values {
              temperatura
              humedad
              created_at
            }
            aggregate {
              totalCount
            }
          }
        }
      `,
      variables() {
        return {
          start: this.start,
          limit: this.limit,
        };
      },
      update(res) {
        const labels = res.climasConnection.values.map(
          (r) => new Date(r.created_at)
        );
        const dataTemp = res.climasConnection.values.map((r) => r.temperatura);
        const dataHum = res.climasConnection.values.map((r) => r.humedad);
        this.data.labels = [...this.data.labels, ...labels];
        this.data.datasets[0].data = [
          ...this.data.datasets[0].data,
          ...dataTemp,
        ];
        this.data.datasets[1].data = [
          ...this.data.datasets[1].data,
          ...dataHum,
        ];
        let prevDay = 0;
        let day = 0;
        const options = {
          scales: {
            xAxes: [
              {
                bounds: "ticks",
                type: "time",
                time: {
                  unit: "hour",
                  displayFormats: {
                    hour: "HH:mm",
                  },
                },
              },
            ],
            yAxes: [
              {
                id: "temp-y-axis",
                type: "linear",
                position: "left",
                ticks: {
                  min: 10,
                  max: 50,
                },
              },
              {
                id: "hum-y-axis",
                type: "linear",
                position: "right",
                ticks: {
                  min: 0,
                  max: 100,
                },
              },
            ],
          },
        };

        if (
          res.climasConnection.aggregate.totalCount >
          this.start + this.limit
        ) {
          this.start += this.limit;
          console.log(this.start);
        } else {
          this.renderChart(this.data, options);
        }
      },
    },
  },
};
</script>
