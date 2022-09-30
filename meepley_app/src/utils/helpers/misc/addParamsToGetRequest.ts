type TGenericObject = Record<string, any>;

export const addParamsToGetRequest = (queries: TGenericObject) => {
  //* object keys gets us an array with the keys
  //* then we loop through the keys with reduce
  //* reduce will keep on adding in each iteration

  return Object.keys(queries)
    .reduce((result: string[], key: string) => {
      //* verify if the value of the key is a empty string
      //* if so don't add it

      if (
        queries[key] !== "" &&
        queries[key] !== undefined &&
        queries[key] !== null
      ) {
        //* verify if the value of the key is an array
        if (Array.isArray(queries[key])) {
          if (queries[key].length >= 1 && queries[key][0] !== "") {
            //* join array values into a single string
            const arrayString = queries[key].join(",");
            return [
              ...result,
              `${encodeURIComponent(key)}=${encodeURIComponent(arrayString)}`,
            ];
          } else {
            return result;
          }
        } else {
          return [
            ...result,
            `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`,
          ];
        }
      } else {
        return result;
      }
    }, [])
    .join("&");
};
