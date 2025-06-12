import { cx } from "@/utils/all";

export default function Label(props) {
  const color = {
    green: {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      hover: "hover:bg-emerald-100"
    },
    blue: {
      text: "text-blue-700",
      bg: "bg-blue-50",
      hover: "hover:bg-blue-100"
    },
    orange: {
      text: "text-orange-700",
      bg: "bg-orange-50",
      hover: "hover:bg-orange-100"
    },
    purple: {
      text: "text-purple-700",
      bg: "bg-purple-50",
      hover: "hover:bg-purple-100"
    },
    pink: {
      text: "text-pink-700",
      bg: "bg-pink-50",
      hover: "hover:bg-pink-100"
    }
  };

  const selectedColor = color[props.color] || color.blue;
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={cx(
          "inline-flex items-center justify-center font-medium px-2.5 py-0.5 text-xs",
          selectedColor.bg,
          selectedColor.text,
          selectedColor.hover,
          "rounded-full transition-colors duration-200",
          "dark:bg-gray-800 dark:text-gray-300"
        )}>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center font-medium px-2.5 py-0.5 text-xs",
        selectedColor.bg,
        selectedColor.text,
        selectedColor.hover,
        "rounded-full transition-colors duration-200",
        !margin && "mt-5",
        "dark:bg-gray-800 dark:text-gray-300"
      )}>
      {props.children}
    </span>
  );
}
