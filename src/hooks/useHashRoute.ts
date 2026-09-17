import { useState, useEffect } from "react";

export type AppPage = "site" | "admin";

function getPage(): AppPage {
  return window.location.hash === "#admin" ? "admin" : "site";
}

export function useHashRoute(): AppPage {
  const [page, setPage] = useState<AppPage>(getPage);

  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return page;
}

