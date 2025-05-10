import { toast } from "vue-sonner";

const showToast = (
  type: "success" | "error",
  title: string,
  description: string
) => {
  toast[type](title, {
    description,
    position: "top-right",
    style: {
      backgroundColor: type === "success" ? "#dcfce7" : "#fef2f2",
      color: type === "success" ? "#15803d" : "#991b1b",
      border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
    },
  });
};

export default showToast;
