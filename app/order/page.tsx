import SideBar from "@/components/navigation/SideBar";
import OrderContent from "@/components/order/OrderContent";

export default function OrderPage() {
  return (
    <div className="h-full">
      <div className="h-full flex">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <OrderContent />
      </div>
    </div>
  );
}