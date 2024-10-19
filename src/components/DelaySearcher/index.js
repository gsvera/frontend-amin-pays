import { Input, Tooltip } from "antd";
import { AlertIcon } from "../Icons/AlertIcon";
import { useEffect, useState } from "react";

export const DelaySearcher = (props) => {
  const {
    infoText,
    onChangeHandler,
    timeDelay,
    loadingSearch,
    valueText,
    cleanValueText,
  } = props;

  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    if (cleanValueText && !valueText) setLocalValue(valueText);
  }, [valueText]);

  useEffect(() => {
    const delay = setTimeout(() => onChangeHandler?.(localValue), timeDelay);
    return () => clearTimeout(delay);
  }, [localValue]);

  return (
    <Input.Search
      loading={loadingSearch}
      addonBefore={
        infoText && (
          <Tooltip title={infoText}>
            <AlertIcon fill={"var(--color-primary)"} />
          </Tooltip>
        )
      }
      onChange={(e) => {
        setLocalValue(e.target.value);
        e.persist();
      }}
      value={localValue}
    />
  );
};

export default DelaySearcher;
