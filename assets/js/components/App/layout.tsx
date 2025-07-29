interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="app-layout">
    <header className="app-header">Kartography</header>
    <main className="app-main-content">{children}</main>
  </div>
);

export default Layout;
