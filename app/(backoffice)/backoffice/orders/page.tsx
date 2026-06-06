"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Card,
  Typography,
  message,
  Button,
  Select,
  Tag,
  Descriptions,
  Divider,
  Tabs,
  Drawer,
  Empty,
  Space,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faFolderOpen,
  faUser,
  faMagnifyingGlass,
  faUsers,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { UserProfile } from "@/shared/interfaces/user";
import { getAllUsers } from "@/apis/admin";
import { getUserOrders, getOrderById, updateOrderStatus } from "@/apis/order";
import { OrderResponse, GetOrderByIdResponse } from "@/shared/types/order";
import SearchBar from "@/components/backoffice/SearchBar";

const { Title } = Typography;

// Status color mapping for tags
const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "gold", label: "Pending" },
  paid: { color: "green", label: "Paid" },
  shipping: { color: "blue", label: "Shipping" },
  completed: { color: "purple", label: "Completed" },
  failed: { color: "red", label: "Failed" },
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Shipping", value: "shipping" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

export default function OrdersPage() {
  // === Order ID search state ===
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [singleOrder, setSingleOrder] = useState<GetOrderByIdResponse | null>(null);
  const [singleOrderLoading, setSingleOrderLoading] = useState<boolean>(false);
  const [orderSearched, setOrderSearched] = useState<boolean>(false);

  // === Browse by customer state ===
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userTotal, setUserTotal] = useState<number>(0);
  const [userPage, setUserPage] = useState<number>(1);
  const [userPageSize, setUserPageSize] = useState<number>(10);
  const [userSearch, setUserSearch] = useState<string>("");

  // === Selected user orders (drawer) ===
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<OrderResponse[]>([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  // === Order detail drawer ===
  const [detailOrder, setDetailOrder] = useState<GetOrderByIdResponse | null>(null);
  const [detailOrderLoading, setDetailOrderLoading] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);

  // === Active tab ===
  const [activeTab, setActiveTab] = useState<string>("order-id");

  // ---------- Fetching ----------

  const fetchUsers = useCallback(
    async (page: number, size: number, searchVal: string) => {
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
    },
    [],
  );

  useEffect(() => {
    if (activeTab === "customer") {
      fetchUsers(userPage, userPageSize, userSearch);
    }
  }, [userPage, userPageSize, activeTab]);

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
      setOrderSearched(false);
      return;
    }
    setSingleOrderLoading(true);
    setSingleOrder(null);
    setOrderSearched(true);
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
    setDrawerVisible(true);
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

  const handleViewOrderDetail = async (orderId: string) => {
    setDetailDrawerVisible(true);
    setDetailOrderLoading(true);
    setDetailOrder(null);
    try {
      const res = await getOrderById(orderId);
      setDetailOrder(res);
    } catch (err: any) {
      message.error("Failed to load order details");
    } finally {
      setDetailOrderLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus as any });
      message.success(`Order status updated to ${newStatus}`);

      // Refresh relevant data
      if (singleOrder && singleOrder.id === orderId) {
        const res = await getOrderById(orderId);
        setSingleOrder(res);
      }
      if (detailOrder && detailOrder.id === orderId) {
        const res = await getOrderById(orderId);
        setDetailOrder(res);
      }
      if (selectedUser) {
        const res = await getUserOrders({ userId: selectedUser.id, pageSize: 50 });
        setUserOrders(res.orders);
      }
    } catch (err: any) {
      message.error("Failed to update order status");
    }
  };

  // ---------- Columns ----------

  const userColumns = [
    {
      title: "Customer",
      key: "name",
      render: (_: any, record: UserProfile) => (
        <div>
          <div className="font-semibold text-gray-800">
            {record.firstName} {record.lastName}
          </div>
          <div className="text-xs text-gray-400">@{record.username}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      width: 160,
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

  // Shared order columns used in the user orders drawer and search results
  const orderColumns = [
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total: number) => (
        <span className="font-medium text-gray-800">${total.toFixed(2)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      render: (status: string, record: OrderResponse) => {
        const config = statusConfig[status] || { color: "default", label: status };
        return (
          <Select
            value={status}
            size="small"
            style={{ width: 130 }}
            onChange={(val) => handleStatusChange(record.id, val)}
            options={statusOptions}
          />
        );
      },
    },
    {
      title: "Details",
      key: "details",
      width: 100,
      render: (_: any, record: OrderResponse) => (
        <Button
          type="link"
          size="small"
          className="text-amber-600 hover:text-amber-500"
          onClick={() => handleViewOrderDetail(record.id)}
        >
          View
        </Button>
      ),
    },
  ];

  // ---------- Tab content ----------

  const renderOrderIdTab = () => (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <SearchBar
            placeholder="Enter Order UUID to look up..."
            value={searchOrderId}
            onChange={setSearchOrderId}
            onSearch={handleSearchOrder}
          />
        </div>
      </div>

      {singleOrderLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-400">Searching...</div>
        </div>
      )}

      {!singleOrderLoading && singleOrder && (
        <div className="space-y-6">
          {/* Order summary card */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-400 font-mono">{singleOrder.id}</div>
                <div className="text-gray-600 text-sm">
                  Placed on{" "}
                  <span className="font-medium text-gray-800">
                    {new Date(singleOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Total</div>
                  <div className="text-xl font-bold text-amber-700">
                    ${singleOrder.totalPrice.toFixed(2)}
                  </div>
                </div>
                <Select
                  value={singleOrder.orderStatus}
                  style={{ width: 150 }}
                  onChange={(val) => handleStatusChange(singleOrder.id, val)}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div>
            <Title level={5} className="!mb-3 text-gray-700">
              Order Items
            </Title>
            <Table
              dataSource={singleOrder.orderItems}
              rowKey="id"
              pagination={false}
              size="small"
              className="border border-gray-50 rounded-lg overflow-hidden"
              columns={[
                {
                  title: "Product",
                  dataIndex: ["product", "name"],
                  key: "name",
                  render: (name: string, record: any) =>
                    name || `Product ID: ${record.productId} (Unavailable)`,
                },
                {
                  title: "Price At Purchase",
                  dataIndex: "priceAtPurchase",
                  key: "priceAtPurchase",
                  render: (price: number) => (
                    <span className="font-medium">${price.toFixed(2)}</span>
                  ),
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
              ]}
            />
          </div>
        </div>
      )}

      {!singleOrderLoading && !singleOrder && orderSearched && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No order found with that ID"
          className="py-16"
        />
      )}

      {!singleOrderLoading && !singleOrder && !orderSearched && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-4xl text-gray-200 mb-3" />
          <div className="text-sm">Enter an Order UUID above to look up order details</div>
        </div>
      )}
    </div>
  );

  const renderCustomerTab = () => (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <SearchBar
            placeholder="Search customers by name, email, username..."
            value={userSearch}
            onChange={setUserSearch}
            onSearch={handleUserSearch}
          />
        </div>
      </div>

      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          current: userPage,
          pageSize: userPageSize,
          total: userTotal,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          onChange: (page, size) => {
            setUserPage(page);
            setUserPageSize(size);
          },
        }}
        className="border border-gray-50 rounded-lg overflow-hidden"
      />
    </div>
  );

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Page header — matches Products / Users pages */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100/50">
        <Title level={2} className="!m-0 text-gray-800 font-bold">
          Orders Management
        </Title>
        <div className="text-gray-400 text-sm mt-1">
          Look up specific orders or browse customer transaction history
        </div>
      </div>

      {/* Main content card with tabs */}
      <Card className="shadow-sm shadow-gray-100/50">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "order-id",
              label: (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} />
                  <span className="sm:hidden">Order ID</span>
                  <span className="hidden sm:inline">Search by Order ID</span>
                </span>
              ),
              children: renderOrderIdTab(),
            },
            {
              key: "customer",
              label: (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} />
                  <span className="sm:hidden">Customer</span>
                  <span className="hidden sm:inline">Browse by Customer</span>
                </span>
              ),
              children: renderCustomerTab(),
            },
          ]}
        />
      </Card>

      {/* Drawer: User orders list */}
      <Drawer
        title={
          selectedUser
            ? `Orders for ${selectedUser.firstName} ${selectedUser.lastName}`
            : "User Orders"
        }
        placement="right"
        size={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnHidden
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center gap-3">
              <div>
                <div className="font-semibold text-gray-800">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <div className="text-xs text-gray-400">
                  @{selectedUser.username} &middot; {selectedUser.email}
                </div>
              </div>
            </div>

            <Table
              dataSource={userOrders}
              rowKey="id"
              loading={userOrdersLoading}
              pagination={{ pageSize: 10 }}
              size="small"
              columns={orderColumns}
              className="border border-gray-50 rounded-lg overflow-hidden"
              scroll={{ x: true }}
            />
          </div>
        )}
      </Drawer>

      {/* Drawer: Order detail (from user orders table "View" button) */}
      <Drawer
        title="Order Details"
        placement="right"
        width={560}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        destroyOnHidden
      >
        {detailOrderLoading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            Loading order details...
          </div>
        )}

        {!detailOrderLoading && detailOrder && (
          <div className="space-y-6">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Order ID">
                <span className="font-mono text-xs">{detailOrder.id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(detailOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <span className="font-semibold text-lg text-amber-700">
                  ${detailOrder.totalPrice.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Select
                  value={detailOrder.orderStatus}
                  style={{ width: 150 }}
                  onChange={(val) => handleStatusChange(detailOrder.id, val)}
                  options={statusOptions}
                />
              </Descriptions.Item>
            </Descriptions>

            <Divider className="my-4" />
            <Title level={5}>Order Items</Title>
            <Table
              dataSource={detailOrder.orderItems}
              rowKey="id"
              pagination={false}
              size="small"
              className="border border-gray-50 rounded-lg overflow-hidden"
              columns={[
                {
                  title: "Product",
                  dataIndex: ["product", "name"],
                  key: "name",
                  render: (name: string, record: any) =>
                    name || `Product ID: ${record.productId} (Unavailable)`,
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
        )}
      </Drawer>
    </div>
  );
}
