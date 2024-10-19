import { useMemo } from "react";
import "./index.scss";

const Button = (props) => {
  const disabledClass = useMemo(
    () => (props?.disabledClass ? props?.disabledClass : "disabled-button"),
    [props?.disabledClass]
  );
  return (
    <button
      type="button"
      onClick={props?.onClick}
      className={`${props?.disabled ? disabledClass : props?.className} click`}
      disabled={props?.disabled}
      style={props?.style}
    >
      {props?.text}
    </button>
  );
};

export default Button;
