import { useMemo } from "react";
import "./index.scss";

export const CustomSwitch = ({ title, checked, setChecked, disabled }) => {
  const localValue = useMemo(() => checked, [checked]);

  const handleChecked = (event) => {
    setChecked?.(event.checked);
  };
  return (
    <div className="switch-center">
      {title && <span style={{ paddingTop: "5px" }}>WhatsApp</span>}
      <label className="switch" style={{ cursor: "not-allowed" }}>
        <input
          type="checkbox"
          onClick={(e) => handleChecked(e.target)}
          checked={localValue}
          disabled={disabled}
        />
        <span
          className={`slider round ${
            disabled &&
            "ant-input-affix-wrapper ant-input-disabled ant-input-affix-wrapper-disabled css-dev-only-do-not-override-14i19y2 ant-input-outlined"
          }`}
        ></span>
      </label>
    </div>
  );
};

export default CustomSwitch;
