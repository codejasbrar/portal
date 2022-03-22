import React from 'react';

// Updates an object in array state at given idx
export function updateObjectInArrayState<T, K extends keyof T>(
  dispatchFn: React.Dispatch<React.SetStateAction<T[]>>,
  idx: number | T[K],
  mergeObj: Partial<T>,
  fieldToCompare?: K,
) {
  dispatchFn((prevArr: T[]) => prevArr.map((obj, stateIdx) => {
    const condition = fieldToCompare
      ? obj[fieldToCompare] === idx
      : stateIdx === idx;
    if (condition) {
      return {
        ...obj,
        ...mergeObj,
      };
    }
    return obj;
  }));
}

// Updates state object, like setState in class components
export function mergeState<T>(
  dispatchFn: React.Dispatch<React.SetStateAction<T>>,
  mergeObj: Partial<T>,
) {
  dispatchFn((prevState) => ({
    ...prevState,
    ...mergeObj,
  }));
}
