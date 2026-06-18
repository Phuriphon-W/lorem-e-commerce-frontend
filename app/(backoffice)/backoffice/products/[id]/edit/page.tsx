"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Typography, message, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUpload, faSave } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useParams } from "next/navigation";
import { Category } from "@/shared/types/category";
import { updateProduct, getAllCategories } from "@/apis/admin";
import { sanitizeErrorMessage } from "@/shared/utils/errorSanitizer";
import { getProductById } from "@/apis/product";

const { Title } = Typography;
const { TextArea } = Input;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);

        const prod = await getProductById({ id });
        form.setFieldsValue({
          name: prod.name,
          categoryId: prod.category.id,
          price: prod.price,
          available: prod.available,
          description: prod.description,
        });
        setCurrentImageUrl(prod.image_url);
      } catch (err: any) {
        message.error("Failed to load product data");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateProduct(id, {
        name: values.name,
        description: values.description || "",
        price: values.price,
        available: values.available,
        imageFile: imageFile || "",
        categoryId: values.categoryId,
      });

      message.success("Product updated successfully");
      router.push("/backoffice/products");
    } catch (err: any) {
      message.error(sanitizeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />}
          onClick={() => router.push("/backoffice/products")}
          className="hover:bg-gray-100 rounded-lg"
        />
        <div>
          <Title level={2} className="!m-0 text-gray-800 font-bold">
            Edit Product
          </Title>
          <div className="text-gray-400 text-sm mt-1">Modify product details and inventory</div>
        </div>
      </div>

      <Card bordered={false} className="shadow-sm shadow-gray-100/50">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: "Please input product name!" },
              { min: 1, message: "Name cannot be empty" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g. Vintage Denim Jacket" className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              placeholder="Select product category"
              className="h-10"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label="Price ($)"
              name="price"
              rules={[
                { required: true, message: "Please input product price!" },
                { type: "number", min: 0.01, message: "Price must be greater than 0!" },
              ]}
            >
              <InputNumber className="w-full h-10 rounded-lg flex items-center" placeholder="19.99" />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              name="available"
              rules={[
                { required: true, message: "Please input product stock!" },
                { type: "number", min: 0, message: "Stock cannot be negative!" },
              ]}
            >
              <InputNumber className="w-full h-10 rounded-lg flex items-center" placeholder="50" />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ max: 500, message: "Description cannot exceed 500 characters" }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe the product details, materials, fit..."
              maxLength={500}
              showCount
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-100 rounded-lg bg-gray-50 items-center">
            {currentImageUrl && !imageFile && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Current Image</span>
                <img
                  src={currentImageUrl}
                  alt="current"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-lg p-4 bg-white w-full space-y-2">
              <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-lg" />
              <span className="text-gray-500 text-xs font-medium">Replace Image (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
              />
              {imageFile && (
                <div className="text-xs text-amber-600 font-semibold mt-1">
                  Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                </div>
              )}
            </div>
          </div>

          <Form.Item className="pt-4 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
              className="w-full bg-amber-600 hover:bg-amber-500 border-none rounded-lg h-11 shadow-sm shadow-amber-500/20"
            >
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
