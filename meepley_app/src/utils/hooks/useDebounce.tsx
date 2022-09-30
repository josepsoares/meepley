import { useEffect, useState } from "react";

//*  see https://github.com/tannerlinsley/react-query/issues/293
//* see https://usehooks.com/useDebounce/
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      //* Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      //* Cancel the timeout if value changes (also on delay change or unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    //* Only re-call effect if value or delay changes
    [value, delay]
  );

  return debouncedValue;
}
