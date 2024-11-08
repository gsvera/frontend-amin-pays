import moment from "moment";
import {
  AMORTIZATION,
  FORMAT_DATE,
  INTEREST_RATE,
  PERIOD_DATE,
} from "@/config/constants";
import { CalculateAddPeriod } from "@/utils/DateUtils";

export const GenerateAmericanAmortization = ({
  startDate,
  amount,
  period,
  periodNum,
  interestRate,
  interest,
}) => {
  const dataAmortization = [
    {
      key: 0,
      payDate: moment(startDate).format(FORMAT_DATE.ES_FORMAT_DATE),
      pay: 0,
      interest: 0,
      amortization: 0,
      balance: amount,
    },
  ];
  let totalPay = 0;
  let totalInterest = 0;
  let totalAmortization = 0;
  let balance = amount;
  let interestRateMontly = interest;
  let lastDatePay = "";

  if (interestRate === INTEREST_RATE.ANUAL) {
    interestRateMontly = interest / 12;
  }

  for (let i = 0; i < periodNum; i++) {
    let interestPay = amount * (interestRateMontly / 100);

    if (period === PERIOD_DATE.QUINCENAL) interestPay = interestPay / 2;

    let amortization = i + 1 === periodNum ? amount : 0;
    let pay = interestPay + amortization;
    balance -= amortization;

    totalPay += pay;
    totalInterest += interestPay;
    totalAmortization += amortization;

    let payDate = CalculateAddPeriod({
      period,
      currentDate: startDate,
      timeAdd: i,
    });

    if (i + 1 === periodNum) lastDatePay = payDate;

    dataAmortization.push({
      key: i + 1,
      payDate: payDate,
      pay: parseFloat(pay.toFixed(2)),
      interest: parseFloat(interestPay.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  }

  return {
    totalPay,
    totalInterest,
    totalAmortization,
    dataAmortization,
    lastDatePay,
  };
};

export const GenerateAlemanAmortizacion = ({
  startDate,
  amount,
  period,
  periodNum,
  interestRate,
  interest,
}) => {
  const dataAmortization = [
    {
      key: 0,
      payDate: moment(startDate).format(FORMAT_DATE.ES_FORMAT_DATE),
      pay: 0,
      interest: 0,
      amortization: 0,
      balance: amount,
    },
  ];
  let totalPay = 0;
  let totalInterest = 0;
  let totalAmortization = 0;
  let lastDatePay = "";
  let balance = amount;
  let amortization = amount / periodNum;
  let interestRateMonthly = interest;

  if (interestRate === INTEREST_RATE.ANUAL) interestRateMonthly = interest / 12;

  for (let i = 0; i < periodNum; i++) {
    let interestPay = balance * (interestRateMonthly / 100);

    if (period === PERIOD_DATE.QUINCENAL) interestPay = interestPay / 2;

    let pay = amortization + interestPay;
    balance -= amortization;

    totalPay += pay;
    totalInterest += interestPay;
    totalAmortization += amortization;

    let payDate = CalculateAddPeriod({
      period,
      currentDate: startDate,
      timeAdd: i,
    });

    if (i + 1 === periodNum) lastDatePay = payDate;

    dataAmortization.push({
      key: i + 1,
      payDate,
      pay: parseFloat(pay.toFixed(2)),
      interest: parseFloat(interestPay.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  }

  return {
    totalPay,
    totalInterest,
    totalAmortization,
    dataAmortization,
    lastDatePay,
  };
};

export const GenerateFrancesAmortizacion = ({
  startDate,
  amount,
  period,
  periodNum,
  interestRate,
  interest,
}) => {
  const dataAmortization = [
    {
      key: 0,
      payDate: moment(startDate).format(FORMAT_DATE.ES_FORMAT_DATE),
      pay: 0,
      interest: 0,
      amortization: 0,
      balance: amount,
    },
  ];
  let totalPay = 0;
  let totalInterest = 0;
  let totalAmortization = 0;
  let balance = amount;
  let lastDatePay = "";
  let interestRateMonthly = interest;

  if (interestRate === INTEREST_RATE.ANUAL) interestRateMonthly = interest / 12;

  let interestPercentage = interestRateMonthly / 100;

  const pay =
    (amount *
      (interestPercentage * Math.pow(1 + interestPercentage, periodNum))) /
    (Math.pow(1 + interestPercentage, periodNum) - 1);

  for (let i = 0; i < periodNum; i++) {
    let interestPay = balance * (interestRateMonthly / 100);

    if (period === PERIOD_DATE.QUINCENAL) interestPay = interestPay / 2;

    let amortization = pay - interestPay;
    balance -= amortization;

    totalPay += pay;
    totalInterest += interestPay;
    totalAmortization += amortization;

    let payDate = CalculateAddPeriod({
      period,
      currentDate: startDate,
      timeAdd: i,
    });

    if (i + 1 === periodNum) lastDatePay = payDate;

    dataAmortization.push({
      key: i + 1,
      payDate,
      pay: parseFloat(pay.toFixed(2)),
      interest: parseFloat(interestPay.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  }

  return {
    totalPay,
    totalInterest,
    totalAmortization,
    dataAmortization,
    lastDatePay,
  };
};

export const GenerateTableAmortization = (
  dataAmortization,
  typeAmortization
) => {
  if (typeAmortization === AMORTIZATION.AMERICANO)
    return GenerateAmericanAmortization({ ...dataAmortization });
  if (typeAmortization === AMORTIZATION.ALEMAN)
    return GenerateAlemanAmortizacion({ ...dataAmortization });
  if (typeAmortization === AMORTIZATION.FRANCES)
    return GenerateFrancesAmortizacion({ ...dataAmortization });
};
