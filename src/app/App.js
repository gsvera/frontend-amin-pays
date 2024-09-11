import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store, persistor } from "../store-redux/store";
// import I18nProvider from "@/providers/LanguageProvider";
import { ApiRequestProvider } from "@/providers/InterceptorProvider";
import { PersistGate } from "redux-persist/integration/react";

export const App = ({ children, lang }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 3000,
        retryDelay: 3000,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ApiRequestProvider>
            {/* <I18nProvider lang={lang}> */}
            {children}
            {/* </I18nProvider> */}
          </ApiRequestProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};
