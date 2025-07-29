interface AppLayoutProps {
  children: React.ReactNode;
}

const MenuBar = ({ children }: AppLayoutProps) => (
  <div className="menubar">
    <Toolbar />
    <MenuBar />
    <main className="main-content">{children}</main>
  </div>
);