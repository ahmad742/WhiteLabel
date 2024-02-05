import React, { useContext, useState, createContext } from "react";

const CustomerContext = createContext();

export function useCustomer() {
  return useContext(CustomerContext);
}

export default function ThemeProvider({ children }) {
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [icons, setIcons] = useState({});

  const updateCustomer = (data = {}) => {
    setCurrentCustomer(data);
  };

  const updateIcons = (iconData = {}) => {
    setIcons(iconData);
  };

  const value = {
    icons,
    updateIcons,
    updateCustomer,
    currentCustomer,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}
