"use client";

import React, { useEffect, useState } from "react";
import { Table, Card, Typography, message, Drawer, Descriptions, Tag, Space, Button, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faEnvelope, faPhone, faMapMarkerAlt, faFolderOpen, faFilter } from "@fortawesome/free-solid-svg-icons";
import { UserProfile } from "@/shared/interfaces/user";
import { getAllUsers } from "@/apis/admin";
import SearchBar from "@/components/backoffice/SearchBar";
import { getUserOrders, updateOrderStatus } from "@/apis/order";
import { OrderResponse } from "@/shared/types/order";

const { Title } = Typography;

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<OrderResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  // Pagination, search, and sorting states
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("created_at DESC");

  const fetchUsers = async (page: number, size: number, searchVal: string, orderVal: string) => {
    setLoading(true);
    try {
      const res = await getAllUsers(page, size, searchVal || undefined, orderVal || undefined);
      setUsers(res.users);
      setTotal(res.total);
    } catch (err: any) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize, search, orderBy);
  }, [currentPage, pageSize, orderBy]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    fetchUsers(1, pageSize, value, orderBy);
  };

  const handleUserClick = async (user: UserProfile) => {
    setSelectedUser(user);
    setDrawerVisible(true);
    setOrdersLoading(true);
    try {
      const res = await getUserOrders({ userId: user.id, pageSize: 50 });
      setUserOrders(res.orders);
    } catch (err: any) {
      message.error("Failed to load user orders");
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus as any });
      message.success(`Order status updated to ${newStatus}`);
      // Refresh orders
      if (selectedUser) {
        const res = await getUserOrders({ userId: selectedUser.id, pageSize: 50 });
        setUserOrders(res.orders);
      }
    } catch (err: any) {
      message.error("Failed to update order status");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Name",
      key: "name",
      render: (_: any, record: UserProfile) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "role",
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? "red" : "blue"}>{isAdmin ? "Admin" : "Customer"}</Tag>
      ),
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
          View Profile & Orders
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100/50">
        <Title level={2} className="!m-0 text-gray-800 font-bold">
          Users Management
        </Title>
        <div className="text-gray-400 text-sm mt-1">Check registered profiles and user order histories</div>
      </div>

      <Card className="shadow-sm shadow-gray-100/50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <SearchBar
              placeholder="Search users by username, name, email..."
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[240px]">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            <Select
              value={orderBy}
              className="w-full h-10"
              onChange={(val) => {
                setOrderBy(val);
                setCurrentPage(1);
              }}
              options={[
                { label: "Newest Accounts", value: "created_at DESC" },
                { label: "Oldest Accounts", value: "created_at ASC" },
                { label: "Name (A-Z)", value: "first_name ASC, last_name ASC" },
                { label: "Name (Z-A)", value: "first_name DESC, last_name DESC" },
              ]}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          className="border border-gray-50 rounded-lg overflow-hidden"
        />
      </Card>

      <Drawer
        title="User Profile & History"
        placement="right"
        size={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnHidden
      >
        {selectedUser && (
          <div className="space-y-6">
            <Descriptions title="Profile Info" bordered column={1}>
              <Descriptions.Item label="User ID">{selectedUser.id}</Descriptions.Item>
              <Descriptions.Item label="Username">{selectedUser.username}</Descriptions.Item>
              <Descriptions.Item label="Full Name">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  {selectedUser.email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Telephone">
                <Space>
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                  {selectedUser.telephone || "N/A"}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Delivery Address" bordered column={1}>
              <Descriptions.Item label="House Number">
                {selectedUser.address?.houseNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Road">{selectedUser.address?.road || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Sub-district">
                {selectedUser.address?.subDistrict || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="District">
                {selectedUser.address?.district || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Province">
                {selectedUser.address?.province || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Zip Code">
                <Space>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                  {selectedUser.address?.zip || "N/A"}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={4} className="text-gray-700 font-bold mb-3">
                User Orders
              </Title>
              <Table
                dataSource={userOrders}
                rowKey="id"
                loading={ordersLoading}
                pagination={{ pageSize: 5 }}
                size="small"
                columns={[
                  {
                    title: "Order ID",
                    dataIndex: "id",
                    key: "id",
                    className: "text-xs font-mono text-gray-400",
                    width: 120,
                    render: (id: string) => id.substring(0, 8) + "...",
                  },
                  {
                    title: "Date",
                    dataIndex: "createdAt",
                    key: "createdAt",
                    render: (date: string) => new Date(date).toLocaleDateString(),
                  },
                  {
                    title: "Total",
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    render: (total: number) => `$${total.toFixed(2)}`,
                  },
                  {
                    title: "Status",
                    dataIndex: "orderStatus",
                    key: "status",
                    render: (status: string, record: OrderResponse) => {
                      let color = "gold";
                      if (status === "paid") color = "green";
                      if (status === "shipping") color = "blue";
                      if (status === "completed") color = "purple";
                      if (status === "failed") color = "red";

                      return (
                        <Select
                          value={status}
                          size="small"
                          style={{ width: 110 }}
                          onChange={(val: string) => handleStatusChange(record.id, val)}
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
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
