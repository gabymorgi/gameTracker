import React from "react";
import AuthProvider from "@/contexts/AuthContext";
import GlobalStyles from "@/GlobalStyles";
import { App, ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { GlobalProvider } from "@/contexts/GlobalContext";

const { darkAlgorithm } = theme;

Cypress.Commands.add("mountWithContext", (children: React.ReactElement) => {
  cy.mount(
    <ConfigProvider
      theme={{
        algorithm: [darkAlgorithm],
        token: {
          colorPrimary: "#00b96b",
          colorInfo: "#00b96b",
          colorLink: "#00b96b",
        },
      }}
    >
      <App>
        <GlobalStyles />
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <AuthProvider>
              <GlobalProvider>
                <div>le context</div>
                {children}
              </GlobalProvider>
            </AuthProvider>
          </QueryParamProvider>
        </BrowserRouter>
      </App>
    </ConfigProvider>,
  );
});
