import Image from "next/image";

type CartItemCardProps = {
  itemName: string;
  itemImageUrl: string;
};

export default function CartItemCard({ itemName, itemImageUrl }: CartItemCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Image Section */}
      <div className="relative w-1/3 aspect-square rounded-2xl overflow-hidden">
        <Image 
            src={itemImageUrl}
            alt={`${itemName}-image`}
            fill
        />
      </div>

      {/* Name Section */}
      <div className="flex w-2/3 items-center">
        {itemName}
      </div>
    </div>
  );
}
