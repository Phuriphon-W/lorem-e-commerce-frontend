import { geistSans, geistMono } from "../layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-amber-50 items-center justify-center">
        {children}
    </div>
  );
}
