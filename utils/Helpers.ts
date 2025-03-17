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
  return (
    String(date.getDate()).padStart(2, "0") +
    "/" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "/" +
    date.getFullYear()
  );
}

function transformArray(arr: DataType[] | string[]) {
  if (arr.every((item) => typeof item === "string")) {
    return arr.map((item) => ({ value: item, label: item }));
  }
  return arr;
}

export {
  capitalizeFirstLetter,
  formateDate,
  splitStringIntoArray,
  transformArray
};

