import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Select,
  Space,
  Divider,
  notification,
  Rate,
} from "antd";
import {
  useGetProductQuery,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from "../store/api/productApi";
import {
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Product, Review } from "../types/product";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: product, isLoading: isProductLoading } = useGetProductQuery(
    Number(id)
  );
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
      });
    }
  }, [product, form]);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: "Product Updated",
        description: "The product has been updated successfully.",
      });
    }

    if (isError) {
      notification.error({
        message: "Update Failed",
        description: "There was an error updating the product.",
      });
    }
  }, [isSuccess, isError]);

  const onFinish = (values) => {
    console.log("Form values:", values);
    updateProduct({
      id: Number(id),
      product: values as Partial<Product>,
    });
  };

  const goBack = () => {
    navigate(`/product/${id}`);
  };

  if (isProductLoading || isCategoriesLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading product.
      </div>
    );
  }

  const categoryOptions =
    categories?.map((category) => ({
      label: category.name,
      value: category.slug,
    })) || [];

  return (
    <div className="edit-form-container my-6">
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Back
          </Button>
          <Title level={2} className="mx-0 mt-3">
            Edit Product
          </Title>
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ...product,
            dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
          }}
        >
          <Title level={4} className="form-section-title">
            Basic Information
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Product Title"
              rules={[
                { required: true, message: "Please enter the product title" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Please select the product category",
                },
              ]}
            >
              <Select
                options={categoryOptions}
                placeholder="Select a category"
                showSearch
                filterOption={(input, option) =>
                  (option?.label?.toString().toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter the product description",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                formatter={(value: string | number | undefined) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: string | undefined) =>
                  value ? parseFloat(value.replace(/\$\s?|(,*)/g, "")) : 0
                }
                className="w-full"
              />
            </Form.Item>

            <Form.Item name="discountPercentage" label="Discount (%)">
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: "Please enter the stock" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="brand" label="Brand">
              <Input />
            </Form.Item>

            <Form.Item name="sku" label="SKU">
              <Input />
            </Form.Item>

            <Form.Item name="weight" label="Weight">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <Title level={4} className="form-section-title mt-6">
            Dimensions
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name={["dimensions", "width"]} label="Width">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name={["dimensions", "height"]} label="Height">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name={["dimensions", "depth"]} label="Depth">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <Title level={4} className="form-section-title mt-6">
            Product Information
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="warrantyInformation" label="Warranty Information">
              <Input />
            </Form.Item>

            <Form.Item name="shippingInformation" label="Shipping Information">
              <Input />
            </Form.Item>

            <Form.Item name="returnPolicy" label="Return Policy">
              <Input />
            </Form.Item>

            <Form.Item name="availabilityStatus" label="Availability Status">
              <Select
                options={[
                  { label: "In Stock", value: "In Stock" },
                  { label: "Low Stock", value: "Low Stock" },
                  { label: "Out of Stock", value: "Out of Stock" },
                  { label: "Pre-order", value: "Pre-order" },
                ]}
              />
            </Form.Item>
          </div>

          <Title level={4} className="form-section-title mt-6">
            Reviews
          </Title>

          <Form.List name="reviews">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="mb-4 bg-gray-50">
                    <div className="flex justify-end">
                      <Button
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        danger
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Form.Item
                        {...restField}
                        name={[name, "reviewerName"]}
                        label="Reviewer Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter reviewer name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "reviewerEmail"]}
                        label="Reviewer Email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter reviewer email",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "rating"]}
                      label="Rating"
                      rules={[
                        { required: true, message: "Please select rating" },
                      ]}
                    >
                      <Rate />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "comment"]}
                      label="Comment"
                      rules={[
                        { required: true, message: "Please enter comment" },
                      ]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "date"]}
                      label="Date"
                      rules={[{ required: true, message: "Please enter date" }]}
                    >
                      <Input type="date" />
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        rating: 5,
                        date: new Date().toISOString().split("T")[0],
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Review
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              size="large"
            >
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductEdit;
