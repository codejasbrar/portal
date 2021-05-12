import {OrdersResponse} from "../interfaces/Order";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import reformatItem from "../helpers/reformatItem";

const useData = (selector: (store: Storage) => OrdersResponse) => {
  const [data, setData] = useState({} as OrdersResponse);
  const items: OrdersResponse = useSelector(selector);

  useEffect(() => {
    if (items.content) {
      setData({
        ...items, content: items.content.map(reformatItem)
      })
    }
  }, [items]);

  return data;
};

export default useData;
