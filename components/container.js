import { cx } from "@/utils/all";

export default function Container(props) {
  return (
    <div
      className={cx(
        "container px-8 mx-auto xl:px-5",
        props.large ? " max-w-screen-2xl" : " max-w-screen-xl",
        !props.alt && "py-5 lg:py-8",
        props.className || ""
      )}>
      {props.children}
    </div>
  );
}
