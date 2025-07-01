import React from "react";
import { Table } from "antd";

interface CustomTableProps {
  dataSource: any[];
  columns: any[];
  currentPage: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  loading?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
  dataSource,
  columns,
  currentPage,
  total,
  onPageChange,
  pageSize = 10,
  loading = false,
}) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource.map((item) => ({
        ...item,
        key: item.id || item.key, // fallback to item.key if no id
      }))}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
};

export default CustomTable;
