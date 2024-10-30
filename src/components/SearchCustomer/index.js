import DelaySearcher from "@/components/DelaySearcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiCustomer from "@/api/services/apiCustomer";
import { useDispatch } from "react-redux";
import { setCustomer } from "@/store-redux/slide/customerSlide";
import "./index.scss";
import CustomList from "../Customer/CustomList";

export const SearchCustomer = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [valueCustomerSearch, setValueCustomerSearch] = useState();
  const listRef = useRef(null);

  const { data: listCustomer = [], isLoading } = useQuery({
    queryKey: REACT_QUERY_KEYS.customer.filterAllData("contracts"),
    queryFn: () => apiCustomer.filterAllData(valueCustomerSearch),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!valueCustomerSearch,
  });

  useEffect(() => {
    if (!!valueCustomerSearch) {
      queryClient.invalidateQueries(
        REACT_QUERY_KEYS.customer.filterAllData("contracts")
      );
    }
  }, [valueCustomerSearch]);

  const dataListCustomer = useMemo(
    () =>
      !valueCustomerSearch
        ? []
        : listCustomer?.map((item) => ({
            id: item?.id,
            text: `${item?.firstName} ${item?.lastName}`,
            tooltip: item?.email,
          })),
    [listCustomer, valueCustomerSearch]
  );

  const searchCustomer = (value) => {
    setValueCustomerSearch(value);
  };

  const handleSelectCustomer = (value) => {
    const valueSelected = listCustomer?.find((item) => item.id === value?.id);
    dispatch(setCustomer(valueSelected));
    setValueCustomerSearch("");
  };

  const handleClickOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      setValueCustomerSearch("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={listRef}>
      <DelaySearcher
        onChangeHandler={searchCustomer}
        timeDelay={1000}
        infoText="Se busca por: nombre"
        loadingSearch={isLoading}
        valueText={valueCustomerSearch}
        cleanValueText
      />
      {valueCustomerSearch && (
        <CustomList
          dataList={dataListCustomer}
          handleSelect={handleSelectCustomer}
          widthList={"265px"}
        />
      )}
    </div>
  );
};

export default SearchCustomer;
