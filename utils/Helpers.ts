import { DataType } from "@/components/DropDown";

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
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function transformArray(arr: DataType[] | string[]) {
  if (arr.every((item) => typeof item === "string")) {
    return arr.map((item) => ({ value: item, label: item }));
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

  return number.toLocaleString("de-DE", {
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

export {
  addNumbers,
  capitalizeFirstLetter,
  formateDate,
  formatEuropeanNumber, parseEuropeanNumber,
  splitStringIntoArray, subtractNumbers, transformArray,
  transformObjectIntoArray
};

