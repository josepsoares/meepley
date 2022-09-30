const checkActiveFiltersLength = (obj) => {
  return [...Object.entries(obj)].reduce((previousVal, currentVal) => {
    if (Array.isArray(currentVal[1])) {
      return currentVal[1].some((item) => item !== "")
        ? previousVal + 1
        : previousVal;
    } else {
      if (currentVal[1] !== "") {
        return previousVal + 1;
      } else {
        return previousVal;
      }
    }
  }, 0);
};

export default checkActiveFiltersLength;
