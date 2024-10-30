import { Snackbar } from "@mui/material";

export default function Notification({
  isOpen,
  msg,
  duration,
  status,
  onClose
}: {
  isOpen: boolean;
  msg: string;
  duration: number | null;
  status: string;
  onClose: () => void;
}) {
  return (
    <div>
      <Snackbar
        open={isOpen}
        autoHideDuration={duration || 6000}
        message={msg}
        color={status == "success" ? "success" : "error"}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      />
    </div>
  );
}
