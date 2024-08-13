"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        closeOnClick={true}
        autoClose={3000}
        closeButton={false}
        draggable={true}
        toastClassName={() =>
          `mb-2 relative flex  justify-between flex-row p-1 rounded-md overflow-hidden cursor-pointer min-h-10`
        }
        bodyClassName={() => `flex flex-row p-4 justify-center rounded-md`}
      />
    </SessionProvider>
  );
}
