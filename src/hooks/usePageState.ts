import {OrdersResponse} from "../interfaces/Order";
import {useEffect, useMemo, useState} from "react";
import {OrderStatus, SortDirection, TestStatus} from "../services/LabSlipApiService";
import {debounce} from "@material-ui/core";
import OrdersStore from "../stores/OrdersStore";
import TestsStore from "../stores/TestsStore";
import reformatItem from "../helpers/reformatItem";

const usePageState = (type: "order" | "test", status: string, data: OrdersResponse) => {
  const [searchText, setSearchText] = useState('');
  const {loadOrdersByStatus} = OrdersStore;
  const {loadResultsByStatus} = TestsStore;
  const [searchParams, setSearchParams] = useState({
    page: 0,
    sort: {param: 'received', direction: 'desc' as SortDirection},
    searchString: ''
  });

  const items = {...data, content: data.content ? data.content.map(reformatItem) : []};

  const onSearch = (value: string) => {
    setSearchParams({...searchParams, page: 0, searchString: value});
  };

  const onSetPage = (page: number) => {
    setSearchParams({...searchParams, page: page})
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), [searchParams.searchString]);

  useEffect(() => {
    debouncedSearch(searchText && searchText.length > 1 ? searchText : '');
  }, [searchText]);

  const onSaved = () => {
    if (type === 'order') loadOrdersByStatus(status as OrderStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString);
    if (type === 'test') loadResultsByStatus(status as TestStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString);
  };

  useEffect(() => {
    onSaved();
  }, [searchParams.page, searchParams.sort, searchParams.searchString]);


  const onSort = (sortParam: string = 'received') => {
    setSearchParams({
      ...searchParams,
      page: 0,
      sort: {param: sortParam, direction: searchParams.sort.direction === 'desc' ? 'asc' : 'desc'}
    })
  };

  return [items as OrdersResponse, searchParams.page as number, searchParams.sort as any, onSort, onSetPage, searchText, setSearchText, onSaved]
};

export default usePageState;
