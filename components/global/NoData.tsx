import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-regular-svg-icons";

type NoDataProps = {
  text: string;
};

export default function NoData({ text }: NoDataProps) {
  return (
    <div className="flex flex-col w-full h-[40vh] md:h-[50vh] text-[14px] md:text-[20px] items-center justify-center border-y border-gray-100">
      {/* Icon */}
      <FontAwesomeIcon icon={faFaceFrown} />

      {/* Text */}
      <div>{text} is empty</div>
    </div>
  );
}
