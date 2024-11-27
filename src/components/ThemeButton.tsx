import { Theme } from "@emotion/react";
import { PrimeReactContext, PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState, useContext } from "react";

export const ThemeButton: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  const { changeTheme } = useContext(PrimeReactContext);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    changeTheme?.(
      `lara-${theme}-teal`,
      `lara-${newTheme}-teal`,
      "app-theme",
      () => setTheme(newTheme)
    );
  };
  return (
    <Button
      icon={theme === "dark" ? PrimeIcons.MOON : PrimeIcons.SUN}
      rounded
      text
      onClick={toggleTheme}
      tooltip="Change theme"
      tooltipOptions={{ position: "left" }}
    />
  );
};
