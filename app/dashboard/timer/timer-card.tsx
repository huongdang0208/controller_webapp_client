import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Device } from "@/app/utils/interfaces/device.interface";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import Popover from "@mui/material/Popover";

import { useMutation } from "@apollo/client";
import Notification from "../../components/notification/notification";
import { ITimer } from "@/app/utils/interfaces/timer.interface";
import { DELETE_TIMER_MUTATION } from "@/app/api/timer.graphql";
import dayjs from "dayjs";

export default function TimerCard({
  timer,
  devicesList,
  setDeletedTimer,
  setActiveTimer,
}: {
  timer: ITimer;
  devicesList: Device[];
  setDeletedTimer: React.Dispatch<React.SetStateAction<ITimer | null>>;
  setActiveTimer: React.Dispatch<React.SetStateAction<ITimer | null>>;
}) {
  const [noti, setNoti] = React.useState<string | null>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [device, setDevice] = React.useState<Device | undefined>(
    devicesList?.find((item: Device) => item?.id === timer.deviceID)
  );
  const [deleteTimerMutation, { error }] = useMutation(DELETE_TIMER_MUTATION);

  const handleExpandOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTimer = async () => {
    try {
      const data = await deleteTimerMutation({
        variables: {
          timerId: timer?.id,
        },
      });
      if (data) {
        setDeletedTimer(timer);
        setNoti("Deleted successful!");
      }
      if (error) {
        setNoti(String(error));
      }
    } catch (err) {
      setNoti(String(err));
    }
  };

  React.useEffect(() => {
    if (timer?.deviceID) {
      setDevice(
        devicesList?.find((item: Device) => item?.id === timer.deviceID)
      );
    }
  }, [timer]);

  React.useEffect(() => {
    if (!timer.time || !timer.date) return;

    // Combine selectedDate and selectedTime into a single Date object
    const time = new Date(timer.time);
    const targetDateTime = dayjs(time)
      .hour(time.getHours())
      .minute(time.getMinutes())
      .second(0);

    // Set up a timer to check every second
    const timerInterval = setInterval(() => {
      const now = dayjs();

      // Check if the current time matches the selected time
      if (now.isSame(targetDateTime, "second")) {
        console.log("Time to perform the action!");
        // Perform the action here
        console.log("it's time");
        setActiveTimer(timer);
        clearInterval(timerInterval); // Clear the timer after the action is triggered
      }
    }, 1000);

    // Clean up the timer when the component unmounts or when selectedDate/selectedTime changes
    return () => clearInterval(timerInterval);
  }, [timer]);

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", flexGrow: 1, cursor: "pointer" }}
      // onClick={handleChangeSelectedDevice}
    >
      <CardHeader
        action={
          <IconButton
            size="small"
            aria-label="settings"
            onClick={handleExpandOption}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {device?.device_name}
              </Typography>
              <Chip
                label={timer?.action}
                color={timer?.action === "ON" ? "success" : "error"}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Stack>
        <br />
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Chip
                label={new Date(timer.time).toLocaleTimeString()}
                color="primary"
                variant="outlined"
              />
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {new Date(timer.date).toLocaleDateString()}
              </Typography>
            </Stack>
            <br />
            <Chip
              label={timer?.status}
              color={timer?.status == "WAITING" ? "success" : "error"}
            />
          </Stack>
          <Notification
            isOpen={!!noti}
            msg={noti || ""}
            duration={2000}
            status={noti === "Delete successful!" ? "success" : "error"}
            onClose={() => setNoti(null)}
          />
        </Stack>
      </CardContent>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Button onClick={handleDeleteTimer} startIcon={<DeleteIcon />}>
          Delete this timer
        </Button>
      </Popover>
    </Card>
  );
}
