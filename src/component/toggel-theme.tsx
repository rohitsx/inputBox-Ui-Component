import { useThemeStore } from "@/store/useThemeStore";
import { Toggle } from "@base-ui-components/react";

export const ToggleTheme = () => {
  const { toggleTheme } = useThemeStore();

  return (
    <Toggle
      value="rohit"
      className="text-white border border-black dark:border-white h-7 w-43"
      onPressedChange={() => toggleTheme()}
    />
  );
};
