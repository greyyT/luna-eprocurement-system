interface SwitchButtonProps {
  checked: boolean;
  onChange: () => void;
  disable?: boolean;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ checked, onChange, disable }) => {
  return (
    <label className="switch">
      <input readOnly type="checkbox" checked={checked} />
      <span
        onClick={() => {
          if (!disable) onChange();
        }}
        className={`slider round ${disable ? 'cursor-not-allowed' : ''}`}
      ></span>
    </label>
  );
};

export default SwitchButton;
