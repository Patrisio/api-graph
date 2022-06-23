import { useEffect, useState, useCallback } from "react";

export const Counter = ({ inc, dec, count }: any) => {
  const trueWord = count > 2 ? '_MORE_THAN_2' : '_LESS_THAN_2';
  const [word, setWord] = useState(trueWord);

  const showWord = useCallback(() => {
    console.log(count.toString() + trueWord);
  }, [count, trueWord]);

  useEffect(() => {
    showWord();

    if (count > 2) {
      setWord("_MORE_THAN_2");
    } else {
      setWord("_LESS_THAN_2");
    }
  }, [count, showWord]);

  return (
    <>
      <p>{count}</p>
      <button onClick={inc}>inc</button>
      <button onClick={dec}>dec</button>
    </>
  );
};
