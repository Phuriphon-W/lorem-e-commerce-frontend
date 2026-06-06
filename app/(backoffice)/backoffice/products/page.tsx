"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Select, Modal, message, Typography, Card, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { Product } from "@/shared/interfaces/product";
import { Category } from "@/shared/types/category";
import { getAllProducts, deleteProduct, getAllCategories } from "@/apis/admin";
import SearchBar from "@/components/backoffice/SearchBar";

const { Title } = Typography;

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchProducts = async (searchVal?: string) => {
    setLoading(true);
    try {
      const res = await getAllProducts({
        pageNumber: page,
        pageSize: pageSize,
        search: searchVal !== undefined ? searchVal : (search || undefined),
        category: selectedCategory || undefined,
      });
      setProducts(res.products);
      setTotal(res.total);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err: any) {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchProducts(value);
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success("Product deleted successfully");
          fetchProducts();
        } catch (err: any) {
          message.error(err.response?.data?.message || "Failed to delete product");
        }
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      width: 80,
      render: (url: string) => (
        <img
          src={url || "/placeholder-product.png"}
          alt="product"
          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Image";
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Product) => (
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-xs text-gray-400 line-clamp-1">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (cat: string) => <Tag color="amber">{cat || "Uncategorized"}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span className="font-medium text-gray-800">${price.toFixed(2)}</span>,
    },
    {
      title: "Stock",
      dataIndex: "available",
      key: "available",
      render: (qty: number) => {
        if (qty === 0) return <Tag color="red">Out of Stock</Tag>;
        if (qty <= 5) return <Tag color="orange">Low Stock: {qty}</Tag>;
        return <Tag color="green">{qty} available</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faEdit} className="text-amber-600" />}
            onClick={() => router.push(`/backoffice/products/${record.id}/edit`)}
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
            Products
          </Title>
          <div className="text-gray-400 text-sm mt-1">Manage and edit your store inventory</div>
        </div>
        <Button
          type="primary"
          icon={<FontAwesomeIcon icon={faPlus} className="mr-1" />}
          className="bg-amber-600 hover:bg-amber-500 border-none rounded-lg h-10 px-5 shadow-sm shadow-amber-500/20"
          onClick={() => router.push("/backoffice/products/create")}
        >
          Add Product
        </Button>
      </div>

      <Card className="shadow-sm shadow-gray-100/50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <SearchBar
              placeholder="Search products..."
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            <Select
              placeholder="Filter by Category"
              allowClear
              className="w-full h-8"
              onChange={(val) => {
                setSelectedCategory(val || "");
                setPage(1);
              }}
              options={[
                { label: "All Categories", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c.name })),
              ]}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          scroll={{ x: true}}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps || 10);
            },
          }}
          loading={loading}
          className="border border-gray-50 rounded-lg overflow-hidden"
        />
      </Card>
    </div>
  );
}
