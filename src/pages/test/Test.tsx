import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  ReactElement,
  useEffect,
} from "react";
import { Counter } from "./Counter";
import { Algo } from "./Algo";
import { isEqual } from "lodash";

export default function Test() {
  const isEquals = isEqual([{ a: 1 }], [{ a: 2 }]);
  console.log(isEquals, "isEquals");
  const [count, setCount] = useState(0);

  const inc = useCallback(() => {
    setCount(() => count + 1);
  }, [count]);

  const dec = useCallback(() => {
    setCount(() => count - 1);
  }, [count]);

  return (
    <div className='App'>
      {/* <Counter inc={inc} dec={dec} count={count} /> */}
      <Algo />
    </div>
  );
}
