"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store/store";
import AuthCheck from "@/app/authCheck/AuthCheck";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <html lang="ko">
          <body>
            <AuthCheck />
            {children}
          </body>
        </html>
      </PersistGate>
    </Provider>
  );
}
