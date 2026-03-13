import { geistSans, geistMono } from "../layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="flex flex-col bg-amber-50 items-center w-full overflow-y-auto h-screen">
          <div className="w-full bg-white h-full overflow-y-auto">
            {children}
          </div>
        </div>
  );
}
