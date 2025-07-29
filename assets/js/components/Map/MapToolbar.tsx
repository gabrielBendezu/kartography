interface MapToolbarProps {
  children: React.ReactNode;
}

const MapToolbar = ({ children }: MapToolbarProps) => {
  return (
    <div className="toolbar">
      Toolbar here
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MapToolbar;
