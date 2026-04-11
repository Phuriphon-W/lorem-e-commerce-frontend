import { ConfigProvider } from "antd";
import { DARK_THEME } from "@/shared/colors";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-amber-50 items-center justify-center">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: DARK_THEME.primary,
          },
          components: {
            Button: {
              // Standard State
              defaultBg: DARK_THEME.background,
              defaultColor: "white",
              defaultBorderColor: "transparent",

              // Hover State
              defaultHoverBg: DARK_THEME.primaryHover,
              defaultHoverColor: "white",
              defaultHoverBorderColor: "transparent",

              // Active (Click) State
              defaultActiveBg: DARK_THEME.background,
              defaultActiveColor: "white",

              // Custom Shadow
              controlOutline: "none", // Removes the blue halo
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
}
