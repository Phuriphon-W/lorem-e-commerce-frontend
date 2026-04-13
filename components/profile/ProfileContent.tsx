"use client";

import { Form, Input, Button, message, Spin, Row, Col } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Typography from "antd/es/typography/Typography";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/apis/user";

export default function ProfileContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getProfile();

        const cleanNulls = (val: string | null) =>
          val === "null" || val === null ? "" : val;

        // Set the state, which we will pass to the Form once it renders
        setInitialData({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          telephone: cleanNulls(data.telephone),
          address: {
            houseNumber: cleanNulls(data.address?.houseNumber),
            road: cleanNulls(data.address?.road),
            district: cleanNulls(data.address?.district),
            subDistrict: cleanNulls(data.address?.subDistrict),
            province: cleanNulls(data.address?.province),
            zip: cleanNulls(data.address?.zip),
          },
        });
      } catch (error) {
        message.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        telephone: values.telephone || "",
        address: {
          houseNumber: values.address?.houseNumber || "",
          road: values.address?.road || "",
          district: values.address?.district || "",
          subDistrict: values.address?.subDistrict || "",
          province: values.address?.province || "",
          zip: values.address?.zip || "",
        },
      };

      await updateProfile(payload);
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col mb-6 md:mb-8 border-b border-gray-200 pb-4">
        <Typography>
          <Title level={3} className="mb-0 text-xl md:text-2xl">
            My Profile
          </Title>
          <Text className="text-gray-500">Manage your personal data</Text>
        </Typography>
      </div>

      {/* Details and Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
        className="w-full"
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Username" name="username">
              <Input disabled className="bg-gray-50 cursor-not-allowed" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email">
              <Input disabled className="bg-gray-50 cursor-not-allowed" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Telephone"
              name="telephone"
              rules={[
                { len: 10, message: "Phone number must be 10 characters" },
                {
                  type: "tel",
                  message: "Phone number must contains only number",
                },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} className="mt-4 md:mt-6 mb-4">
          Address Information
        </Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="House Number" name={["address", "houseNumber"]} rules={[{ max: 10, message: "Exceed Maximum Length (10 characters)" }, { type: "tel", message: "Only numbers are allowed" }]}>
              <Input placeholder="e.g. 123/45" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Road" name={["address", "road"]}>
              <Input placeholder="Road name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="District" name={["address", "district"]}>
              <Input placeholder="District" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Sub-District" name={["address", "subDistrict"]}>
              <Input placeholder="Sub-District" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Province" name={["address", "province"]}>
              <Input placeholder="Province" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Zip Code" name={["address", "zip"]} rules={[{ max: 6, message: "Exceed Maximum Length (6 characters)" }, { type: "tel", message: "Only numbers are allowed" }]}>
              <Input placeholder="Zip Code" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            size="large"
            className="w-full md:w-auto"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
