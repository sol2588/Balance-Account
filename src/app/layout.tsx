"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store/store";
import AuthCheck from "@/app/authCheck/AuthCheck";
import Nav from "./components/common/nav/Nav";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <html lang="ko">
          <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>
            <body>
              <AuthCheck />
              <Nav />
              {children}
            </body>
          </GoogleOAuthProvider>
        </html>
      </PersistGate>
    </Provider>
  );
}
