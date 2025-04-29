import React, { useState } from "react";
import { Table, Button, Input, Space, Card, Typography, Rate, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../store/api/productApi";
import { Product } from "../types/product";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductList: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetProductsQuery({
    limit: pagination.pageSize,
    skip: (pagination.current - 1) * pagination.pageSize,
  });

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
  };

  const viewProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Product) => (
        <div className="flex items-center">
          <img
            src={record.thumbnail}
            alt={record.title}
            className="w-12 h-12 rounded-md mr-4 object-cover"
          />
          <div>
            <div className="font-medium">{record.title}</div>
            <Text type="secondary" className="text-xs">
              {record.brand}
            </Text>
          </div>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string, record: Product) =>
        record.title.toLowerCase().includes(value.toLowerCase()) ||
        record.description.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number, record: Product) => (
        <div>
          <Text strong>${price.toFixed(2)}</Text>
          {record.discountPercentage > 0 && (
            <div className="text-xs text-green-600">
              {record.discountPercentage}% off
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number, record: Product) => {
        const stockStatus =
          stock > 20 ? "success" : stock > 5 ? "warning" : "error";

        return <Tag color={stockStatus}>{stock} in stock</Tag>;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Rate disabled allowHalf defaultValue={rating} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Product) => (
        <Button type="primary" onClick={() => viewProduct(record.id)}>
          View Details
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Products</Title>
        <Input
          placeholder="Search products"
          prefix={<SearchOutlined />}
          className="w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Card className="product-list-card">
        <Table
          dataSource={data?.products || []}
          columns={columns}
          rowKey="id"
          pagination={{
            ...pagination,
            total: data?.total || 0,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => viewProduct(record.id),
          })}
        />
      </Card>
    </div>
  );
};

export default ProductList;
