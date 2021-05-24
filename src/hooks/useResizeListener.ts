import {useEffect, useState} from "react";
import getWidth from "../helpers/getWidth";

const useResizeListener = () => {
  const [width, setWidth] = useState(getWidth());
  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  });
  return width;
};

export default useResizeListener;
