import React from 'react';
import ReusableLineChart from '../../Compontents/ReusableLineChart';

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

  return (
    <ReusableLineChart
      title="Daily Inventory Trend"
      categories={categories}
      series={series}
      colors={['#007bff', '#e91e63']}
    />
  );
};

export default InventoryLineChart;
