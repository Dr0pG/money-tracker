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
    date.getDate() +
    "/" +
    parseInt(String(date.getMonth() + 1)) +
    "/" +
    date.getFullYear()
  );
}

export { capitalizeFirstLetter, formateDate, splitStringIntoArray };

