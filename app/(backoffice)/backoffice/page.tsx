"use client";

import { Card, Row, Col, Statistic, Typography, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faTags,
  faReceipt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "@/shared/colors";
import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/apis/admin";

const { Title, Paragraph } = Typography;

export default function BackOfficeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        message.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 h-full">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm shadow-gray-100/50">
        <Title level={2} className="!m-0 text-gray-800 font-bold">
          Welcome to Lorem Admin Panel
        </Title>
        <Paragraph className="text-gray-500 mt-2 mb-0">
          Manage products, view categories, manage orders, and check user profiles.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-400 font-medium">Products</span>}
              value={stats.productsCount}
              precision={0}
              loading={loading}
              styles={{ content: { color: COLORS["main-primary-dark"], fontWeight: "bold" } }}
              prefix={<FontAwesomeIcon icon={faBox} className="mr-2 opacity-80" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-400 font-medium">Categories</span>}
              value={stats.categoriesCount}
              precision={0}
              loading={loading}
              styles={{ content: { color: COLORS["main-primary-dark"], fontWeight: "bold" } }}
              prefix={<FontAwesomeIcon icon={faTags} className="mr-2 opacity-80" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-400 font-medium">Orders</span>}
              value={stats.ordersCount}
              precision={0}
              loading={loading}
              styles={{ content: { color: COLORS["main-primary-dark"], fontWeight: "bold" } }}
              prefix={<FontAwesomeIcon icon={faReceipt} className="mr-2 opacity-80" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-400 font-medium">Users</span>}
              value={stats.usersCount}
              precision={0}
              loading={loading}
              styles={{ content: { color: COLORS["main-primary-dark"], fontWeight: "bold" } }}
              prefix={<FontAwesomeIcon icon={faUsers} className="mr-2 opacity-80" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
