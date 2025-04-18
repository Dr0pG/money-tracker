import { BarChartData } from "@/app/(home)/(3_tab)";
import { DataType } from "@/components/DropDown";
import i18n from "@/i18n";
import { Transaction, TransactionType } from "@/store/walletStore";

function capitalizeFirstLetter(str: string) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

function splitStringIntoArray(str: string = "", splitValue: string = ",") {
  if (!str) return [];
  const cleanString = str.replace(/\s/g, "");
  return cleanString.split(splitValue);
}

function formateDate(date: Date) {
  if (!date) return "";
  return date.toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function transformArray(arr: DataType[] | string[]) {
  if (arr.every((item) => typeof item === "string")) {
    return arr.map((item) => ({ value: item, label: i18n.t(item.toLowerCase()) }));
  }
  return arr;
}

function transformObjectIntoArray(arr: any[]) {
  const formattedArray = arr
    ? Object.entries(arr).map(([id, item]) => ({
        id,
        ...item,
      }))
    : [];

  return formattedArray;
}

function parseEuropeanNumber(numberString: string) {
  if (typeof numberString !== "string") return NaN;

  // Convert "1.234,56" → "1234.56"
  return parseFloat(numberString.replace(/\./g, "").replace(",", "."));
}

function formatEuropeanNumber(number: number) {
  if (typeof number !== "number" || isNaN(number)) return "";

  return number.toLocaleString(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function addNumbers(num1: number, num2: number) {
  const result = Math.round((num1 + num2) * 100) / 100;
  return result;
}

function subtractNumbers(num1: number, num2: number) {
  return Math.round((num1 - num2) * 100) / 100;
}

const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  // Create a new date object to avoid mutating the original one
  const startOfWeek = new Date(date);

  startOfWeek.setDate(date.getDate() + diff);

  // Ensure we set the time to 00:00:00.000 (start of the day in local time)
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

// Function to get the end of the week (Sunday)
const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date); // Get the start of the week (Monday)
  const endOfWeek = new Date(startOfWeek);

  // Add 6 days to get the Sunday at the end of the week
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Set the time to the last moment of Sunday (23:59:59.999)
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
};

const getStartOfMonth = (date: Date): Date => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0); // Set the time to midnight (local time)
  return startOfMonth;
};

const getEndOfMonth = (date: Date): Date => {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999); // Set to the last moment of the last day (local time)
  return lastDayOfMonth;
};

const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
};

const groupByDay = (
  transactions: Transaction[],
  from: Date,
  to: Date
): Record<string, Transaction[]> => {
  const daysMap: Record<string, Transaction[]> = {};

  const current = new Date(from);
  current.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const key = formatDateKey(current);
    daysMap[key] = [];
    current.setDate(current.getDate() + 1);
  }

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const key = formatDateKey(txDate);
    if (daysMap[key]) {
      daysMap[key].push(tx);
    }
  });

  return daysMap;
};

const groupByYear = (
  transactions: Transaction[]
): Record<string, Transaction[]> => {
  const yearMap: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    const year = new Date(tx.date).getFullYear().toString();
    if (!yearMap[year]) yearMap[year] = [];
    yearMap[year].push(tx);
  });
  return yearMap;
};

const getLabel = (dateStr: string, type: "weekly" | "monthly"): string => {
  const date = new Date(dateStr);
  if (type === "weekly") {
    return date.toLocaleDateString(i18n.language, { weekday: "short" });
  } else if (type === "monthly") {
    return date.toLocaleDateString(i18n.language, {
      month: "2-digit",
      day: "numeric",
    });
  }
  return "";
};

const buildBarData = (
  groupedData: Record<string, Transaction[]>,
  type: "weekly" | "monthly" | "yearly",
  colors: {
    incomeColor: string;
    expenseColor: string;
    invisibleColor: string;
    labelTextColor: string;
  }
): BarChartData[] => {
  const invisibleValue = 0.1;

  const result: BarChartData[] = [];

  Object.entries(groupedData).forEach(([key, txs]) => {
    const incomeTotal = txs
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseTotal = txs
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    const label = type === "yearly" ? key : getLabel(key, type);
    const labelWidth = type === "weekly" ? 30 : 37;

    result.push({
      value: incomeTotal === 0 ? invisibleValue : incomeTotal,
      label,
      spacing: 2,
      labelWidth,
      labelTextStyle: { color: colors.labelTextColor },
      frontColor:
        incomeTotal === 0 ? colors.invisibleColor : colors.incomeColor,
    });

    result.push({
      value: expenseTotal === 0 ? invisibleValue : expenseTotal,
      frontColor:
        expenseTotal === 0 ? colors.invisibleColor : colors.expenseColor,
    });
  });

  return result;
};

type SectionData = {
  title: string;
  data: Transaction[];
};

const groupTransactionsByDate = (
  transactions: Transaction[] | undefined,
  currentTab: number
): SectionData[] => {
  if (!transactions) return [];

  const groups: { [key: string]: Transaction[] } = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date);

    let dayKey = date.toLocaleDateString(i18n.language, {
      weekday: "long",
    });

    if (currentTab === 1) {
      dayKey = date.toLocaleDateString(i18n.language, {
        month: "long",
        day: "numeric",
      });
    }
    if (currentTab === 2) {
      dayKey = date.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
      });
    }

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(tx);
  });

  return Object.entries(groups)
    .sort((a, b) => {
      const dateA = new Date(a[1][0].date);
      const dateB = new Date(b[1][0].date);
      return dateB.getTime() - dateA.getTime(); // Descending order
    })
    .map(([title, data]) => ({
      title,
      data,
    }));
};

const deepEqual = (obj1: Record<string, any>, obj2: Record<string, any>) => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

const formatLanguage = (language: string) => {
  switch (language) {
    case "en":
      return "english";
    case "pt":
      return "portuguese";
    case "fr":
      return "french";
    default:
      return "english";
  }
};

export {
  addNumbers,
  buildBarData,
  capitalizeFirstLetter,
  deepEqual,
  formateDate,
  formatEuropeanNumber,
  formatLanguage,
  getEndOfMonth,
  getEndOfWeek,
  getStartOfMonth,
  getStartOfWeek,
  groupByDay,
  groupByYear,
  groupTransactionsByDate,
  parseEuropeanNumber,
  splitStringIntoArray,
  subtractNumbers,
  transformArray,
  transformObjectIntoArray,
};
