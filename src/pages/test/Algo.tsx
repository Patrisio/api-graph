import { prependListener } from "process";
import React from "react";
import LinkedList from "./algo/data-structures/linked-list/LinkedList";

export const Algo = () => {
  const linkedList = new LinkedList();
  console.log(linkedList, "INITIAL");

  linkedList.append(5).prepend(66);
  console.log(linkedList, "second");
  linkedList.append(33).prepend(8);
  console.log(linkedList, "second");

  return <></>;
};
