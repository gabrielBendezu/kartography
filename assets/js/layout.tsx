interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="app-layout">
    <header>Kartography</header>
    <main className="main-content">{children}</main>
  </div>
);
