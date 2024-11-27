import { PrimeReactContext, PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type Theme = "light" | "dark" | "system";

const THEME_ROTATION: Theme[] = ["dark", "light", "system"];
const ICONS: Record<Theme, string> = {
  dark: PrimeIcons.MOON,
  light: PrimeIcons.SUN,
  system: PrimeIcons.EYE,
};

/** The theme in the index.html head */
const INITIAL_THEME: Theme = "dark";

/** The default theme if the user has no local stored setting */
const DEFAULT_THEME: Theme = "system";
const THEME_CSS_ID = "app-theme";

export const ThemeButton: React.FC = () => {
  const systemTheme = useSystemTheme();
  const [userTheme, setUserTheme] = useLocalStorage<Theme>(
    "user-theme",
    undefined
  );

  const [theme, setTheme] = useState<Theme>(userTheme ?? DEFAULT_THEME);

  const { changeTheme } = useContext(PrimeReactContext);

  const actualTheme = theme === "system" ? systemTheme : theme;

  // update initial user/system theme, once only
  useEffect(() => {
    changeTheme?.(
      `lara-${INITIAL_THEME}-teal`,
      `lara-${actualTheme}-teal`,
      THEME_CSS_ID
    );
  });

  const toggleTheme = () => {
    const prevActualTheme = theme === "system" ? systemTheme : theme;
    const newIndex = THEME_ROTATION.indexOf(theme) + 1;

    const nextTheme = THEME_ROTATION[newIndex % THEME_ROTATION.length];
    const nextActualTheme = nextTheme === "system" ? systemTheme : nextTheme;

    // TODO: figure out why changing to system theme doesnt update properly when prev and next are
    // correct.
    changeTheme?.(
      `lara-${prevActualTheme}-teal`,
      `lara-${nextActualTheme}-teal`,
      THEME_CSS_ID,
      () => {
        setTheme(nextTheme);
        setUserTheme(nextTheme);
      }
    );
  };
  return (
    <Button
      icon={ICONS[theme]}
      rounded
      text
      onClick={toggleTheme}
      tooltip="Change theme"
      tooltipOptions={{ position: "left" }}
    />
  );
};

function useSystemTheme() {
  const isDark = useMemo(() => {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  const [systemTheme, setSystemTheme] = useState<Theme>(
    isDark ? "dark" : "light"
  );

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newTheme = event.matches ? "dark" : "light";
        setSystemTheme(newTheme);
      });
  });

  return systemTheme;
}
