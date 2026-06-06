"use client";

import React, { useEffect, useState } from "react";
import { Table, Card, Typography, message, Button, Space, Select, Tag, Descriptions, Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faFolderOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserProfile } from "@/shared/interfaces/user";
import { getAllUsers } from "@/apis/admin";
import { getUserOrders, getOrderById, updateOrderStatus } from "@/apis/order";
import { OrderResponse, GetOrderByIdResponse } from "@/shared/types/order";
import SearchBar from "@/components/backoffice/SearchBar";

const { Title } = Typography;

export default function OrdersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [singleOrder, setSingleOrder] = useState<GetOrderByIdResponse | null>(null);
  const [singleOrderLoading, setSingleOrderLoading] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<OrderResponse[]>([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);

  // Pagination and search states for users sidebar
  const [userTotal, setUserTotal] = useState<number>(0);
  const [userPage, setUserPage] = useState<number>(1);
  const [userPageSize, setUserPageSize] = useState<number>(5);
  const [userSearch, setUserSearch] = useState<string>("");

  const fetchUsers = async (page: number, size: number, searchVal: string) => {
    setLoading(true);
    try {
      const res = await getAllUsers(page, size, searchVal || undefined, undefined);
      setUsers(res.users);
      setUserTotal(res.total);
    } catch (err: any) {
      message.error("Failed to load users for orders view");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(userPage, userPageSize, userSearch);
  }, [userPage, userPageSize]);

  const handleUserSearch = (value: string) => {
    setUserSearch(value);
    setUserPage(1);
    fetchUsers(1, userPageSize, value);
  };

  const handleSearchOrder = async (value: string) => {
    setSearchOrderId(value);
    const orderId = value.trim();
    if (!orderId) {
      setSingleOrder(null);
      return;
    }
    setSingleOrderLoading(true);
    setSingleOrder(null);
    setSelectedUser(null);
    try {
      const res = await getOrderById(orderId);
      setSingleOrder(res);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Order not found");
    } finally {
      setSingleOrderLoading(false);
    }
  };

  const handleUserClick = async (user: UserProfile) => {
    setSelectedUser(user);
    setSingleOrder(null);
    setUserOrdersLoading(true);
    try {
      const res = await getUserOrders({ userId: user.id, pageSize: 50 });
      setUserOrders(res.orders);
    } catch (err: any) {
      message.error("Failed to load orders for this user");
      setUserOrders([]);
    } finally {
      setUserOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus as any });
      message.success(`Order status updated to ${newStatus}`);

      // Refresh data
      if (singleOrder && singleOrder.id === orderId) {
        const res = await getOrderById(orderId);
        setSingleOrder(res);
      }
      if (selectedUser) {
        const res = await getUserOrders({ userId: selectedUser.id, pageSize: 50 });
        setUserOrders(res.orders);
      }
    } catch (err: any) {
      message.error("Failed to update order status");
    }
  };

  const userColumns = [
    {
      title: "Customer",
      key: "name",
      render: (_: any, record: UserProfile) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: UserProfile) => (
        <Button
          type="link"
          icon={<FontAwesomeIcon icon={faFolderOpen} className="mr-1" />}
          onClick={() => handleUserClick(record)}
          className="text-amber-600 hover:text-amber-500"
        >
          View Orders
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100/50">
        <Title level={2} className="!m-0 text-gray-800 font-bold">
          Orders Management
        </Title>
        <div className="text-gray-400 text-sm mt-1">Search specific orders or browse user transaction details</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Search Order" bordered={false} className="shadow-sm shadow-gray-100/50">
            <SearchBar
              placeholder="Enter Order UUID..."
              value={searchOrderId}
              onChange={setSearchOrderId}
              onSearch={handleSearchOrder}
              className="w-full h-10 rounded-lg"
            />
          </Card>

          <Card title="Browse by Customer" bordered={false} className="shadow-sm shadow-gray-100/50">
            <div className="mb-4">
              <SearchBar
                placeholder="Search customers..."
                value={userSearch}
                onChange={setUserSearch}
                onSearch={handleUserSearch}
                size="small"
                className="w-full rounded-lg"
              />
            </div>
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                current: userPage,
                pageSize: userPageSize,
                total: userTotal,
                size: "small",
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                onChange: (page, size) => {
                  setUserPage(page);
                  setUserPageSize(size);
                },
              }}
              size="small"
              className="border border-gray-50 rounded-lg overflow-hidden"
            />
          </Card>
        </div>

        <div className="lg:col-span-2">
          {singleOrder && (
            <Card title={`Order details: ${singleOrder.id}`} bordered={false} className="shadow-sm shadow-gray-100/50">
              <div className="space-y-4">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Order ID">{singleOrder.id}</Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {new Date(singleOrder.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Price">
                    <span className="font-semibold text-lg text-amber-700">
                      ${singleOrder.totalPrice.toFixed(2)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Select
                      value={singleOrder.orderStatus}
                      style={{ width: 150 }}
                      onChange={(val) => handleStatusChange(singleOrder.id, val)}
                      options={[
                        { label: "Pending", value: "pending" },
                        { label: "Paid", value: "paid" },
                        { label: "Shipping", value: "shipping" },
                        { label: "Completed", value: "completed" },
                        { label: "Failed", value: "failed" },
                      ]}
                    />
                  </Descriptions.Item>
                </Descriptions>

                <Divider className="my-4" />
                <Title level={5}>Order Items</Title>
                <Table
                  dataSource={singleOrder.orderItems}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Product",
                      dataIndex: ["product", "name"],
                      key: "name",
                      render: (name: string, record: any) => name || `Product ID: ${record.productId} (Unavailable)`,
                    },
                    {
                      title: "Price At Purchase",
                      dataIndex: "priceAtPurchase",
                      key: "priceAtPurchase",
                      render: (price: number) => `$${price.toFixed(2)}`,
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                  ]}
                />
              </div>
            </Card>
          )}

          {selectedUser && (
            <Card
              title={`Orders for: ${selectedUser.firstName} ${selectedUser.lastName}`}
              bordered={false}
              className="shadow-sm shadow-gray-100/50"
            >
              <Table
                dataSource={userOrders}
                rowKey="id"
                loading={userOrdersLoading}
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: "Order ID",
                    dataIndex: "id",
                    key: "id",
                    className: "text-xs font-mono text-gray-400",
                    render: (id: string) => id.substring(0, 8) + "...",
                  },
                  {
                    title: "Date",
                    dataIndex: "createdAt",
                    key: "createdAt",
                    render: (date: string) => new Date(date).toLocaleString(),
                  },
                  {
                    title: "Total Price",
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    render: (total: number) => `$${total.toFixed(2)}`,
                  },
                  {
                    title: "Status",
                    dataIndex: "orderStatus",
                    key: "status",
                    render: (status: string, record: OrderResponse) => {
                      return (
                        <Select
                          value={status}
                          style={{ width: 130 }}
                          onChange={(val) => handleStatusChange(record.id, val)}
                          options={[
                            { label: "Pending", value: "pending" },
                            { label: "Paid", value: "paid" },
                            { label: "Shipping", value: "shipping" },
                            { label: "Completed", value: "completed" },
                            { label: "Failed", value: "failed" },
                          ]}
                        />
                      );
                    },
                  },
                ]}
              />
            </Card>
          )}

          {!singleOrder && !selectedUser && (
            <Card className="flex items-center justify-center min-h-[300px] text-gray-400 shadow-sm shadow-gray-100/50">
              <div className="text-center space-y-2">
                <FontAwesomeIcon icon={faReceipt} className="text-4xl text-gray-300" />
                <div>Select a customer or enter an Order ID to view details.</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
