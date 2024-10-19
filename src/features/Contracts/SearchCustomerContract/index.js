import DelaySearcher from "@/components/DelaySearcher";
import { CustomerListSearch } from "@/components/Customer/CustomerListSearch";
import { CustomAntEmpty } from "@/components/CustomAntEmpty";
import { List } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiCustomer from "@/api/services/apiCustomer";
import { useDispatch } from "react-redux";
import { setCustomer } from "@/store-redux/slide/customerSlide";
import "./index.scss";

export const SearchCustomerContract = () => {
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

  const dataListCustomer = useMemo(() => {
    if (!valueCustomerSearch) return [];

    return listCustomer;
  }, [listCustomer, valueCustomerSearch]);

  const searchCustomer = (value) => {
    setValueCustomerSearch(value);
  };

  const handleSelectCustomer = (item) => {
    dispatch(setCustomer(item));
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
        <List
          className="list-contract-customer"
          dataSource={dataListCustomer}
          renderItem={(item) => (
            <CustomerListSearch
              customer={item}
              onClick={handleSelectCustomer}
            />
          )}
          locale={{
            emptyText: dataListCustomer ? (
              <CustomAntEmpty
                type="error"
                msg="No se encontro un cliente con ese nombre"
              />
            ) : (
              <div></div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default SearchCustomerContract;
