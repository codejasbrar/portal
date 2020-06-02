import React, {useRef, useEffect, ReactElement} from "react";

type ClickOutsidePropsTypes = {
  children: ReactElement[] | ReactElement,
  onClickOutside: () => void
};

const ClickOutside = (props: ClickOutsidePropsTypes) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target as HTMLDivElement)) {
        props.onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props]);

  return <div ref={ref}>{props.children}</div>;
};

export default ClickOutside;