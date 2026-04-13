import { CartItem } from "@/shared/interfaces/cart";
import { formatNumber } from "@/shared/utils/number";
import { InputNumber, message, Button } from "antd";
import Image from "next/image";
import { editCartItem, deleteCartItems } from "@/apis/cart";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type CartItemCardProps = {
  item: CartItem;
  userId?: string;
  onRefresh?: () => Promise<void>;
};

export default function CartItemCard({
  item,
  userId,
  onRefresh,
}: CartItemCardProps) {
  // Edit Quantity
  const onQuantityChange = async (productId: string, val: number | null) => {
    if (!val || !userId) return;

    try {
      await editCartItem({ userId, productId, quantity: val });
      if (onRefresh) await onRefresh(); // Fetch the updated list
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
      if (onRefresh) await onRefresh(); // Fetch the updated list
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

  return (
    <div className="flex md:flex-row gap-4 w-full">
      {/* Image Section */}
      <div className="relative w-1/3 aspect-square rounded-2xl overflow-hidden">
        <Image src={item.image_url} alt={`${item.name}-image`} fill />
      </div>

      {/* Text Section */}
      <div className="flex flex-col md:flex-row w-2/3 md:items-center text-[14px] md:text-[16px] gap-1">
        {/* Name */}
        <div>{item.name}</div>

        <div className="md:hidden">
        {/* Unit Price */}
        <div>{`$${formatNumber(item.price)}`}</div>

        {/* In Cart and Delete Button */}
        <div className="w-full flex items-center gap-4">
          <div className="w-[115px]">
            <InputNumber
              mode="spinner"
              defaultValue={item.quantity}
              size="small"
              min={1}
              max={item.available}
              onChange={(newVal) => onQuantityChange(item.productId, newVal)}
            />
          </div>
          <Button
            type="text"
            danger
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => onItemRemove(item.productId)}
          />
        </div>

        {/* Total For This Item */}
        <div>
          Tota Price: {`$${formatNumber(item.quantity * item.price)}`}
        </div>
        </div>
      </div>
    </div>
  );
}
