// components/InventoryLineChart.tsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'antd';

interface SlotData {
  date: string;
  total_quantity: number;
}

interface Props {
  mrngData: SlotData[];
  eveningData: SlotData[];
}

const InventoryLineChart: React.FC<Props> = ({ mrngData, eveningData }) => {
  const categories = mrngData.map((item) => item.date);

  const series = [
    {
      name: 'Morning',
      data: mrngData.map((item) => item.total_quantity),
    },
    {
      name: 'Evening',
      data: eveningData.map((item) => item.total_quantity),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
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
    colors: ['#007bff', '#e91e63'],
    legend: {
      position: 'top',
    },
  };

  return (
    <Card title="Daily Inventory Trend" style={{ marginTop: 24 }}>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </Card>
  );
};

export default InventoryLineChart;
