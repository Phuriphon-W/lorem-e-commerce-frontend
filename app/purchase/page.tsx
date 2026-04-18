import SideBar from "@/components/navigation/SideBar";
import PurchaseContent from "@/components/purchase/PurchaseContent";

export default function PurchasePage() {
  return (
    <div className="h-full ">
      <div className="h-full flex">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <PurchaseContent />
      </div>
    </div>
  );
}
