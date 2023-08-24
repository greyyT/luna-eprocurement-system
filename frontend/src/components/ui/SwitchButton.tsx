interface SwitchButtonProps {
  checked: boolean;
  onChange: () => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ checked, onChange }) => {
  return (
    <label className="switch">
      <input readOnly type="checkbox" checked={checked} />
      <span onClick={onChange} className="slider round"></span>
    </label>
  );
};

export default SwitchButton;
