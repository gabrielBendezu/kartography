interface AppLayoutProps {
  children: React.ReactNode;
}

const MenuBar = ({ children }: AppLayoutProps) => (
  <div className="menubar">
    <main className="menubar">{children}</main>
  </div>
);
