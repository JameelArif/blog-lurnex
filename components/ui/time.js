import { parseISO, format } from "date-fns";
import { cx } from "@/utils/all";

export default function DateTime({ date, className }) {
  return (
    <time className={cx(className && className)} dateTime={date}>
      {(() => {
        try {
          if (!date) return "Unknown date";
          const parsedDate = parseISO(date);
          if (isNaN(parsedDate.getTime())) return "Invalid date";
          return format(parsedDate, "MMMM dd, yyyy");
        } catch (error) {
          return "Invalid date";
        }
      })()}
    </time>
  );
}
