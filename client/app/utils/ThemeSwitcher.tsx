"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center mx-4">
      {isDark ? (
        <BiSun
          size={25}
          className="cursor-pointer text-white"
          onClick={handleThemeChange}
        />
      ) : (
        <BiMoon
          size={25}
          className="cursor-pointer text-black"
          onClick={handleThemeChange}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;

