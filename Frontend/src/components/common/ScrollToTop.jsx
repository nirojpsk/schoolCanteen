import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(hash.replace("#", ""));

      if (element) {
        element.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}
