import moment from "moment";
import { FORMAT_DATE, PERIOD_DATE } from "@/config/constants";

export const formatDate = (date, format = FORMAT_DATE.GENERAL_FORMAT_DATE) => {
  return moment(date).format(format);
};

export const CalculateAddPeriod = ({ period, currentDate, timeAdd }) => {
  if (period === PERIOD_DATE.MES) {
    return moment(currentDate)
      .add("month", timeAdd + 1)
      .format(FORMAT_DATE.ES_FORMAT_DATE);
  } else if (period === PERIOD_DATE.QUINCENAL) {
    return moment(currentDate)
      .add("days", 15 * (timeAdd + 1))
      .format(FORMAT_DATE.ES_FORMAT_DATE);
  }
};

const disabledDateAfterToday = {
  disabledDate: (v) => v && v.isAfter(moment().endOf("day")),
};

export const DATE_PICKER_PROPS = {
  disabledDateAfterToday,
};

export default {
  formatDate,
  CalculateAddPeriod,
  DATE_PICKER_PROPS,
};
