import days from "../../constants/days";

export default (daysArr: string[]) => {
  if (daysArr.length === 7) {
    return "Aberto todos os dias";
  } else if (daysArr.length === 1) {
    const article =
      daysArr[0] === "Domingo" || daysArr[0] === "Sábado" ? "o" : "a";

    return `Aberto somente durante ${article} ${days[0]}`;
  } else if (daysArr.length >= 3) {
    const closedDays = days.filter((item) => !daysArr.includes(item));

    const closedDaysString = closedDays.map((item) => item).join(", ");
    closedDays[closedDays.length - 1].replace(", ", "");

    return `Aberto todos os dias excepto ${closedDaysString}`;
  } else {
    const openDays = daysArr.map((item) => item).join(", ");
    openDays[openDays.length - 1].replace(", ", "");

    return `Aberto somente ${openDays}`;
  }
};
