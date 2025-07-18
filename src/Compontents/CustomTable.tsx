import React from "react";
import { Table } from "antd";
import "../Styles/CustomTable.css"

interface CustomTableProps {
  dataSource: any[];
  columns?: any[];
  currentPage?: number;
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
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
      className="custom-table-header"
      columns={columns}
      dataSource={dataSource.map((item) => ({
        ...item,
        key: item.id || item.key,
      }))}
      loading={loading}
      pagination={{
        className:"custom-pagination",
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20','30','40'],
        onChange: onPageChange,
        onShowSizeChange: onPageChange,
      }}
    />
  );
};

export default CustomTable;
