import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'antd';

interface SeriesData {
  name: string;
  data: number[];
}

interface LineChartProps {
  title: string;
  categories: string[];
  series: SeriesData[];
  colors?: string[];
  height?: number;
}

const ReusableLineChart: React.FC<LineChartProps> = ({
  title,
  categories,
  series,
  colors = ['#007bff', '#e91e63'],
  height = 350,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      background:"#F6FFED",
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories,
      title: { text: 'Date' },
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: 'Quantity' },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    colors,
    legend: {
      position: 'top',
    },
  };

  return (
    <Card title={title} style={{ marginTop: 24 }}>
      <ReactApexChart options={options} series={series} type="line" height={height} />
    </Card>
  );
};

export default ReusableLineChart;
