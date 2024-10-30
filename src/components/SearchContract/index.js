import { useEffect, useState, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DelaySearcher from "../DelaySearcher";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiContract from "@/api/services/apiContract";
import "./index.scss";
import CustomList from "../Customer/CustomList";

export const SearchContract = ({ handleSelectContract }) => {
  const queryClient = useQueryClient();
  const [valueContractSearch, setValueContractSearch] = useState();
  const listRef = useRef(null);

  const { data: listContract = [], isLoading } = useQuery({
    queryKey: [REACT_QUERY_KEYS.contract.getByCustomerContract("pay-contract")],
    queryFn: () => apiContract.getByCustomerContract(valueContractSearch),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!valueContractSearch,
  });

  useEffect(() => {
    if (!!valueContractSearch)
      queryClient.invalidateQueries([
        REACT_QUERY_KEYS.contract.getByCustomerContract("pay-contract"),
      ]);
  }, [valueContractSearch]);

  const dataListContract = useMemo(
    () =>
      !valueContractSearch
        ? []
        : listContract?.map((item) => ({
            id: item?.id,
            text: `Folio: ${item?.folio} | Cliente: ${item?.customerFirstName} ${item?.customerLastName}`,
          })),
    [valueContractSearch, listContract]
  );

  const searcContract = (item) => {
    setValueContractSearch(item);
  };

  const handleSelectItem = (value) => {
    const contract = listContract?.find((item) => item?.id === value.id);
    handleSelectContract(contract);
    setValueContractSearch("");
  };

  const handleClickOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      setValueContractSearch("");
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
        onChangeHandler={searcContract}
        timeDelay={1000}
        infoText="Se busca por: Nombres, Apellidos, folio de contrato"
        loadingSearch={isLoading}
        valueText={valueContractSearch}
        cleanValueText
      />
      {valueContractSearch && (
        <CustomList
          dataList={dataListContract}
          handleSelect={handleSelectItem}
        />
      )}
    </div>
  );
};

export default SearchContract;
