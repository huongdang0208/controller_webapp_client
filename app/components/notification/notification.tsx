import { Snackbar } from "@mui/material";

export default function Notification({
  isOpen,
  msg,
  duration,
  status,
}: {
  isOpen: boolean;
  msg: string;
  duration: number | null;
  status: string;
}) {
  return (
    <div>
      <Snackbar
        open={isOpen}
        autoHideDuration={duration || 6000}
        message={msg}
        color={status == "success" ? "success" : "error"}
        // onClose={() => {}}
      />
    </div>
  );
}
