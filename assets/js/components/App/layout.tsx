interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col h-screen w-full">
    <header className="bg-warning text-warning-content px-8 py-3 text-lg font-normal flex-shrink-0">
      Kartography
    </header>
    <main className="flex-1 overflow-hidden">{children}</main>
  </div>
);

export default Layout;
