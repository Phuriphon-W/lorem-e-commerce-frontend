"use client";

import { CartItem } from "@/shared/interfaces/cart";
import { Table, TableProps, InputNumber, Button, message } from "antd";
import Text from "antd/es/typography/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "@/shared/utils/number";
import { editCartItem, deleteCartItems } from "@/apis/cart";
import "./CartTable.scss"
import axios from "axios";

type CartTableProps = {
  cartItems: CartItem[];
  userId: string;
  onRefresh: () => Promise<void>;
};

export default function CartTable({
  cartItems,
  userId,
  onRefresh,
}: CartTableProps) {
  // Edit Item Quantity
  const onQuantityChange = async (productId: string, val: number | null) => {
    if (!val || !userId) return;

    try {
      await editCartItem({ userId, productId, quantity: val });
      await onRefresh(); // Fetch the updated list
    } catch (err) {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.detail || "Failed to update quantity",
          duration: 2,
        });
      }
    }
  };

  // Remove Item
  const onItemRemove = async (productId: string) => {
    if (!userId) return;

    try {
      // Note: deleteCartItems expects an array of productIds
      await deleteCartItems({ userId, productIds: [productId] });
      await onRefresh(); // Fetch the updated list
      message.success("Item removed from cart");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.detail || "Failed to remove item",
          duration: 2,
        });
      }
    }
  };

  const columns: TableProps<CartItem>["columns"] = [
    {
      title: "Items",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: "150px",
      render: (val) => `$${formatNumber(val)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "180px",
      render: (val, record) => (
        <InputNumber
          mode="spinner"
          defaultValue={val}
          min={1}
          max={record.available}
          onChange={(newVal) => onQuantityChange(record.productId, newVal)}
        />
      ),
    },
    {
      title: "Total Price",
      key: "totalPrice",
      align: "center",
      width: "150px",
      render: (_, record) => `$${formatNumber(record.price * record.quantity)}`,
    },
    {
      title: "Actions",
      key: "deleteButton",
      align: "center",
      width: "80px",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={() => onItemRemove(record.productId)}
        />
      ),
    },
  ];

  return (
    <div className="w-full md:w-[90%]">
      <Table
        style={{ width: "100%" }}
        bordered
        columns={columns}
        dataSource={cartItems}
        rowKey={"productId"}
        summary={(pageData) => {
          let totalAmount = 0;

          // Calculate the total of all items in the current data array
          pageData.forEach(({ price, quantity }) => {
            totalAmount += price * quantity;
          });

          return (
            <Table.Summary.Row >
              {/* Span across Name, Unit Price, and Quantity */}
              <Table.Summary.Cell index={0} colSpan={3} className="rounded-bl-lg">
                <Text strong className="float-right mr-4">
                  Total Amount:
                </Text>
              </Table.Summary.Cell>

              {/* Output the calculated total under the Total Price column */}
              <Table.Summary.Cell index={1} align="center">
                <Text strong>${formatNumber(totalAmount)}</Text>
              </Table.Summary.Cell>

              {/* Empty cell under the Actions column */}
              <Table.Summary.Cell index={2} className="rounded-br-lg"></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
}
