import { useMemo } from "react";
import "./index.scss";
import { Tooltip } from "antd";

const Button = (props) => {
  const disabledClass = useMemo(
    () => (props?.disabledClass ? props?.disabledClass : "disabled-button"),
    [props?.disabledClass]
  );
  return (
    <Tooltip title={props?.tooltip}>
      <button
        type="button"
        onClick={props?.onClick}
        className={`${
          props?.disabled ? disabledClass : props?.className
        } click`}
        disabled={props?.disabled}
        style={props?.style}
      >
        {props?.text}
      </button>
    </Tooltip>
  );
};

export default Button;
