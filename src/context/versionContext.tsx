"use client";

import api from "@/lib/axiosCall";
import { createContext, useContext, useEffect, useState } from "react";

const VersionContext: any = createContext(undefined);

export const VersionProvider = ({ children }: any) => {
  const [version, setVersion] = useState(0);
  const [oldVersion, setOldVersion] = useState(0);
  const [isOutDated, setIsOutDated] = useState(false);
  const [isAbnormalVersion, setIsAbnormalVersion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrintable, setIsPrintable] = useState(false);
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await api.get("/app-version");
        const version = response.data.version;
        const lsAppVersion: any = localStorage.getItem("ls-app-version");
        if (Number(version) > Number(lsAppVersion) || lsAppVersion === null) {
          localStorage.setItem("ls-app-version", version);
        }
        if (Number(version) < Number(lsAppVersion)) {
          localStorage.setItem("ls-app-version", version);
        }
        setVersion(version);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVersion();
  }, []);

  const updateVersion = () => {
    const fetchVersion = async () => {
      setIsPrintable(false);
      setIsLoading(true);
      try {
        const response = await api.get("/app-version");
        const version = response.data.version;
        const lsAppVersion: any = localStorage.getItem("ls-app-version");
        setVersion(version);
        setOldVersion(lsAppVersion);

        if (Number(version) > Number(lsAppVersion) || lsAppVersion === null) {
          console.error(
            `Version Out of date! New Version: ${version}, Current Version: ${lsAppVersion}`
          );
          setIsOutDated(true);
          setIsAbnormalVersion(false);
          setIsPrintable(false);
          setIsPrintable(false);
        } else if (Number(version) < Number(lsAppVersion)) {
          console.error(
            `Version is abnormal! New Version: ${version}, Current Version: ${lsAppVersion}`
          );
          setIsAbnormalVersion(true);
          setIsOutDated(false);
          setIsPrintable(false);
          setIsPrintable(false);
        } else {
          setIsOutDated(false);
          setIsAbnormalVersion(false);

          if (response.status === 200) {
            setIsPrintable(true);
          }
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  };

  return (
    <VersionContext.Provider
      value={{
        version,
        updateVersion,
        isOutDated,
        setIsOutDated,
        oldVersion,
        setIsAbnormalVersion,
        isAbnormalVersion,
        isLoading,
        isPrintable,
        setIsPrintable,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => useContext(VersionContext);
