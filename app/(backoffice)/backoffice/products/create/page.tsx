"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  message,
  Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUpload,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { Category } from "@/shared/types/category";
import { createProduct, getAllCategories } from "@/apis/admin";

const { Title } = Typography;
const { TextArea } = Input;

export default function CreateProductPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (err: any) {
        message.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const onFinish = async (values: any) => {
    if (!imageFile) {
      message.error("Please select a product image file");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name: values.name,
        description: values.description || "",
        price: values.price,
        available: values.available,
        imageFile: imageFile,
        categoryId: values.categoryId,
      });

      message.success("Product created successfully");
      router.push("/backoffice/products");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 full mx-auto">
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
          }
          onClick={() => router.push("/backoffice/products")}
          className="hover:bg-gray-100 rounded-lg"
        />
        <div>
          <Title level={2} className="!m-0 text-gray-800 font-bold">
            Create Product
          </Title>
          <div className="text-gray-400 text-sm mt-1">
            Add a new item to your online shop
          </div>
        </div>
      </div>

      <Card className="shadow-sm shadow-gray-100/50">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ available: 10, price: 9.99 }}
          className="space-y-4"
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: "Please input product name!" },
              { min: 1, message: "Name cannot be empty" },
            ]}
          >
            <Input
              placeholder="e.g. Vintage Denim Jacket"
              className="h-10 rounded-lg"
            />
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
                {
                  type: "number",
                  min: 0.01,
                  message: "Price must be greater than 0!",
                },
              ]}
            >
              <InputNumber
                className="w-full h-10 rounded-lg flex items-center"
                placeholder="19.99"
              />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              name="available"
              rules={[
                { required: true, message: "Please input product stock!" },
                {
                  type: "number",
                  min: 0,
                  message: "Stock cannot be negative!",
                },
              ]}
            >
              <InputNumber
                className="w-full h-10 rounded-lg flex items-center"
                placeholder="50"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input product description!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe the product details, materials, fit..."
              maxLength={500}
              showCount
              className="rounded-lg"
            />
          </Form.Item>

          <div className="border border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center space-y-2">
            <FontAwesomeIcon
              icon={faUpload}
              className="text-gray-400 text-2xl"
            />
            <span className="text-gray-500 text-sm font-medium">
              Upload Product Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
            />
            {imageFile && (
              <div className="text-xs text-amber-600 font-semibold mt-1">
                Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)}{" "}
                KB)
              </div>
            )}
          </div>

          <Form.Item className="pt-4 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
              className="w-full bg-amber-600 hover:bg-amber-500 border-none rounded-lg h-11 shadow-sm shadow-amber-500/20"
            >
              Save Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
