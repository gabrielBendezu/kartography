interface ToolSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position: { x: number; y: number };
}

const ToolSettings = ({
  isOpen,
  onClose,
  children,
  position,
}: ToolSettingsProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="card bg-base-100 shadow-xl border border-base-200 absolute z-50 w-64"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="card-title text-sm">Tool Settings</h3>
          <button className="btn btn-ghost btn-xs btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ToolSettings
