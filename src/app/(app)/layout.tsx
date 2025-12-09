import { NavigationMenu } from "@/components/navigation-menu";

export default function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-screen">
      <NavigationMenu />
      {children}
      {sheet}
    </div>
  );
}
