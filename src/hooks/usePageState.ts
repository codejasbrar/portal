import {OrdersResponse} from "../interfaces/Order";
import {useDispatch} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {OrderStatus, SortDirection, TestStatus} from "../services/LabSlipApiService";
import useData from "./useData";
import {debounce} from "@material-ui/core";
import {loadOrdersByStatus} from "../actions/ordersActions";
import {loadTestsByStatus} from "../actions/testsActions";

const usePageState = (type: "order" | "test", status: string, selector: (store: Storage) => OrdersResponse) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useState({
    page: 0,
    sort: {param: 'received', direction: 'desc' as SortDirection},
    searchString: ''
  });
  const items = useData(selector);

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

  const onSaved = async () => {
    setLoading(true);
    if (type === 'order') await dispatch(loadOrdersByStatus(status as OrderStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString));
    if (type === 'test') await dispatch(loadTestsByStatus(status as TestStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString));
    setLoading(false);
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

  return [loading, items as OrdersResponse, searchParams.page as number, searchParams.sort as any, onSort, onSetPage, searchText, setSearchText, onSaved]
};

export default usePageState;
