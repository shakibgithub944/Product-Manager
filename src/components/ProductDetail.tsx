import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../store/api/productApi";
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Tag,
  Image,
  Modal,
  Divider,
  Rate,
  List,
  Space,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Review } from "../types/product";

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductQuery(Number(id));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading product details.
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/product/edit/${id}`);
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
          Back to List
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Edit Product
        </Button>
      </div>

      <Card className="product-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="product-image-container col-span-1">
            <Image
              src={product.images[0] || product.thumbnail}
              alt={product.title}
              className="max-h-80 object-contain mx-auto cursor-pointer"
              onClick={() =>
                setSelectedImage(product.images[0] || product.thumbnail)
              }
              preview={false}
            />
          </div>
          <div className="col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <Title level={2}>{product.title}</Title>
                {product.brand && (
                  <Text type="secondary">Brand: {product.brand}</Text>
                )}
              </div>
              <div className="text-right">
                <Text className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </Text>
                {product.discountPercentage > 0 && (
                  <div className="text-sm text-green-600">
                    {product.discountPercentage}% off
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center mt-2">
              <Rate disabled allowHalf value={product.rating} />
              <Text className="ml-2">({product.rating})</Text>
              <Tag color="blue" className="ml-4">
                {product.category}
              </Tag>
            </div>

            <Divider />

            <Paragraph className="text-gray-700">
              {product.description}
            </Paragraph>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Statistic title="Stock" value={product.stock} />
              <Statistic title="SKU" value={product.sku || "N/A"} />
              <Statistic
                title="Status"
                value={product.availabilityStatus || "Available"}
              />
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4">
                <Text type="secondary">Tags: </Text>
                {product.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="product-details-section mb-6">
        <Title level={4}>Product Details</Title>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          {product.dimensions && (
            <>
              <Descriptions.Item label="Width">
                {product.dimensions.width}
              </Descriptions.Item>
              <Descriptions.Item label="Height">
                {product.dimensions.height}
              </Descriptions.Item>
              <Descriptions.Item label="Depth">
                {product.dimensions.depth}
              </Descriptions.Item>
            </>
          )}
          {product.weight && (
            <Descriptions.Item label="Weight">
              {product.weight}
            </Descriptions.Item>
          )}
          {product.warrantyInformation && (
            <Descriptions.Item label="Warranty">
              {product.warrantyInformation}
            </Descriptions.Item>
          )}
          {product.shippingInformation && (
            <Descriptions.Item label="Shipping">
              {product.shippingInformation}
            </Descriptions.Item>
          )}
          {product.returnPolicy && (
            <Descriptions.Item label="Return Policy">
              {product.returnPolicy}
            </Descriptions.Item>
          )}
          {product.minimumOrderQuantity && (
            <Descriptions.Item label="Minimum Order">
              {product.minimumOrderQuantity}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card className="product-details-section">
        <Title level={4}>Reviews</Title>
        <List
          dataSource={product.reviews}
          renderItem={(review: Review) => (
            <List.Item>
              <Card className="review-card w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{review.reviewerName}</div>
                    <Text type="secondary" className="text-sm">
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                  </div>
                  <Rate disabled value={review.rating} />
                </div>
                <Paragraph className="mt-4">{review.comment}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        open={!!selectedImage}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        width="auto"
        centered
        className="image-preview-modal"
        styles={{
          mask: {
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.85)",
          },
          content: {
            padding: 0,
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Product preview"
            className="w-full max-w-[500px] mx-auto"
            preview={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductDetail;
