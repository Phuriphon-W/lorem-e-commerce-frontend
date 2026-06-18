"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, Form, message, Typography, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faTags } from "@fortawesome/free-solid-svg-icons";
import { Category } from "@/shared/types/category";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/apis/admin";
import { sanitizeErrorMessage } from "@/shared/utils/errorSanitizer";

const { Title } = Typography;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err: any) {
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrEdit = async (values: { name: string }) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: values.name });
        message.success(`Category updated to "${values.name}"`);
      } else {
        await createCategory({ name: values.name });
        message.success(`Category "${values.name}" created successfully`);
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      message.error(sanitizeErrorMessage(err));
    }
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete category "${name}"? This will delete or unassign all products under this category!`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success("Category deleted successfully");
          fetchCategories();
        } catch (err: any) {
          message.error(sanitizeErrorMessage(err));
        }
      },
    });
  };

  const columns = [
    {
      title: "Category ID",
      dataIndex: "id",
      key: "id",
      className: "text-xs text-gray-400 font-mono",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-semibold text-gray-800">{name}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faEdit} className="text-amber-600" />}
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue({ name: record.name });
              setModalVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faTrash} className="text-red-500" />}
            onClick={() => handleDelete(record.id, record.name)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100/50">
        <div>
          <Title level={2} className="!m-0 text-gray-800 font-bold">
            Categories
          </Title>
          <div className="text-gray-400 text-sm mt-1">Organize your store catalog with product groups</div>
        </div>
        <Button
          type="primary"
          icon={<FontAwesomeIcon icon={faPlus} className="mr-1" />}
          className="bg-amber-600 hover:bg-amber-500 border-none rounded-lg h-10 px-5 shadow-sm shadow-amber-500/20"
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Card className="shadow-sm shadow-gray-100/50">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="border border-gray-50 rounded-lg overflow-hidden"
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
        }}
        footer={null}
        destroyOnHidden
        className="rounded-xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrEdit} className="mt-4">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Please input category name!" },
              { min: 1, message: "Name cannot be empty" },
              { max: 50, message: "Category name cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="e.g. Footwear" className="h-10 rounded-lg" />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="bg-amber-600 hover:bg-amber-500 border-none rounded-lg">
                {editingCategory ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
