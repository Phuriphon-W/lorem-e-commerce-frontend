type ItemDetailProps = {
  label: string;
  details: string | number;
};

export default function ItemDetail({ label, details }: ItemDetailProps) {
  return (
    <div className="flex flex-row gap-4 py-2 border-b border-gray-100 text-base">
      {/* Label */}
      <div className="font-semibold text-gray-500 w-28 shrink-0">{label}:</div>

      {/* Details */}
      <div className="text-gray-800 font-medium">{details}</div>
    </div>
  );
}