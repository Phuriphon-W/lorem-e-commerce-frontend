import SideBar from "@/components/navigation/SideBar";
import ProfileContent from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="h-full ">
      <div className="h-full flex">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <ProfileContent />
      </div>
    </div>
  );
}
