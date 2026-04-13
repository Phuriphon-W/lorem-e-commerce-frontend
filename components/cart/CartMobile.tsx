import { CartItem } from "@/shared/interfaces/cart";
import CartItemCard from "./CartItemCard";
import Typography from "antd/es/typography/Typography";
import Title from "antd/es/typography/Title";
import { formatNumber } from "@/shared/utils/number";

type CartMobileProps = {
  cartItems: CartItem[];
  userId: string;
  onRefresh: () => Promise<void>;
};

export default function CartMobile({
  cartItems,
  userId,
  onRefresh,
}: CartMobileProps) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full border-t border-gray-200 gap-8">
      <div className="flex flex-col">
        {cartItems.map((item) => (
          <div
            className="px-4 py-4 border-b border-gray-200"
            key={item.productId}
          >
            <CartItemCard item={item} userId={userId} onRefresh={onRefresh} />
          </div>
        ))}
        <div className="text-end px-10 pt-7">
          <Typography>
            <Title level={4}>
              Total Amount: {`$${formatNumber(totalAmount)}`}
            </Title>
          </Typography>
        </div>
      </div>
    </div>
  );
}
