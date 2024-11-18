export const REACT_QUERY_KEYS = {
  user: {
    save: (key) => `save-data-user-${key}`,
  },
  customer: {
    filterData: (key) => `customer-filter-data-${key}`,
    filterAllData: (key) => `customer-filter-all-data-${key}`,
    getById: (key) => `customer-by-id-${key}`,
  },
  customerNote: {
    getByCustomer: (key) => `get-note-by-customer-${key}`,
  },
  contract: {
    getByCustomer: (key) => `get-cotract-by-customer-${key}`,
    getByCustomerContract: (key) => `get-by-customer-contract-${key}`,
    getById: (key) => `get-contract-by-id-${key}`,
    getContractWithDetails: (key) => `get-contract-with-detail-${key}`,
  },
  product: {
    getAll: (key) => `get-all-product-${key}`,
  },
};
