"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid2";

import Copyright from "@/app/components/main-grid/copy-rights";
import { Device } from "@/app/utils/interfaces/device.interface";
import { useMutation, useQuery } from "@apollo/client";
import {
  ALL_TIMER_QUERY,
  CREATE_TIMER_MUTATION,
  UPDATE_TIMER_STATUS_MUTATION,
} from "@/app/api/timer.graphql";
import Notification from "../../components/notification/notification";
import { ITimer } from "@/app/utils/interfaces/timer.interface";
import TimerCard from "./timer-card";
import { MqttClient } from "mqtt";
import { UPDATE_DEVICE_MUTATION } from "@/app/api/device.graphql";

export default function Timer({
  listDevices,
  userID,
  mqttClient,
}: {
  listDevices: Device[];
  userID: number;
  mqttClient: MqttClient | null;
}) {
  const theme = useTheme();
  const now = dayjs();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(
    null
  );
  const [action, setAction] = React.useState<string>("ON");
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [time, setTime] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [noti, setNoti] = React.useState<string | null>(null);
  const [deletedTimer, setDeletedTimer] = React.useState<ITimer | null>(null);
  const [createTimerMutation] = useMutation(CREATE_TIMER_MUTATION);
  const { data, refetch } = useQuery(ALL_TIMER_QUERY, {
    variables: {
      userId: userID,
    },
  });
  const [updateDeviceMutation, { error }] = useMutation(UPDATE_DEVICE_MUTATION);
  const [updateTimerMutation] = useMutation(UPDATE_TIMER_STATUS_MUTATION);
  const [timerList, setTimerList] = React.useState<ITimer[] | []>(
    data?.all_timers?.timers
  );
  const [activeTimer, setActiveTimer] = React.useState<ITimer | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChooseDevice = (event: SelectChangeEvent) => {
    const deviceName = event.target.value;
    setSelectedDevice(
      listDevices?.find(
        (device: Device) => device.device_name === deviceName
      ) || null
    );
  };

  const handleChangeAction = (event: SelectChangeEvent) => {
    setAction(event.target.value as string);
  };

  const handleChangeDate = (date: Dayjs | null) => {
    setDate(date);
  };

  const handleActiveTimer = async () => {
    try {
      const res = await updateDeviceMutation({
        variables: {
          input: {
            id: activeTimer?.deviceID,
            current_state: activeTimer?.action === "ON" ? 1 : 0,
          },
        },
      });
      if (res.data) {
        const device: Device = res.data?.update_device;
        if (device?.protocol === "MQTT") {
          const topic = `hub/switches`;
          const message = `${
            activeTimer?.action === "OFF" ? "turn off" : "turn on"
          } - [state: ${activeTimer?.action === "OFF" ? 0 : 1}
          id: ${device.id}
          name: "${device.device_name}"
          ]`;
          mqttClient?.publish(topic, message);
        } else {
          const topic = `hub/lights`;
          const message = `${
            activeTimer?.action === "OFF" ? "turn off" : "turn on"
          } - [state: ${activeTimer?.action === "OFF" ? 0 : 1}
          id: ${device.id}
          name: "${device.device_name}"
          ]`;
          mqttClient?.publish(topic, message);
        }
        const data = await updateTimerMutation({
          variables: {
            input: {
              id: activeTimer?.id,
              status: "EXPIRED",
            },
          },
        });
        if (data?.data) {
          refetch();
        }
        setNoti("Update successful!");
      } else {
        setNoti("Update failed!" + (error?.message || ""));
      }
    } catch (err) {
      setNoti(String(err));
    }
  };

  React.useEffect(() => {
    if (userID) {
      refetch();
    }
  }, [userID]);

  React.useEffect(() => {
    if (data?.all_timers) {
      setTimerList(data?.all_timers?.timers);
    }
  }, [data]);

  React.useEffect(() => {
    if (deletedTimer) {
      setTimerList(timerList?.filter((item) => item?.id !== deletedTimer?.id));
    }
  }, [deletedTimer, setDeletedTimer]);

  React.useEffect(() => {
    if (activeTimer) {
      handleActiveTimer();
    }
  }, [activeTimer, setActiveTimer]);

  const handleCreateSetTimer = async () => {
    const selectedDate = date?.format("YYYY-MM-DD");
    const selectedTime = time?.format("hh:mm:ss");
    if (action && selectedDevice && selectedDate && selectedTime) {
      try {
        const data = await createTimerMutation({
          variables: {
            input: {
              action: action,
              userID: Number(userID),
              deviceID: selectedDevice?.id,
              time: time,
              date: selectedDate,
              status: "WAITING",
            },
          },
        });
        if (data?.data) {
          refetch();
          setNoti("Create successfully");
        } else {
          setNoti("Fail to create timer");
        }
      } catch (err) {
        setNoti(String(err));
      }
    } else {
      setNoti("Missing some fields!");
    }
    handleClose();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Set timer for devices
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {timerList?.map((timer: ITimer, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <TimerCard
              timer={timer}
              devicesList={listDevices || []}
              setDeletedTimer={setDeletedTimer}
              setActiveTimer={setActiveTimer}
            />
          </Grid>
        ))}
      </Grid>
      <br />
      <Button
        variant="contained"
        size="small"
        color="primary"
        endIcon={<AddIcon />}
        fullWidth={isSmallScreen}
        onClick={handleClickOpen}
      >
        Set timer
      </Button>
      <Copyright />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ width: "700px", minWidth: "700px", margin: "auto" }}
      >
        <DialogTitle id="alert-dialog-title">{"Set new timer"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="device-select-label">Device</InputLabel>
            <Select
              labelId="device-select-label"
              id="device-select"
              value={selectedDevice?.device_name || ""}
              label="Device"
              onChange={handleChooseDevice}
            >
              {listDevices?.map((d) => (
                <MenuItem key={d.id} value={d.device_name}>
                  {d.device_name} - {d.protocol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Select
              labelId="action-select-label"
              id="action-select"
              value={action}
              label="Action"
              onChange={handleChangeAction}
            >
              <MenuItem value={"ON"}>ON</MenuItem>
              <MenuItem value={"OFF"}>OFF</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={handleChangeDate}
                minDate={now}
              />
              <TimePicker
                value={time}
                onChange={(newValue) => setTime(newValue)}
                minTime={
                  date && dayjs(date).isSame(now, "day") ? now : undefined
                }
              />
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateSetTimer} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        isOpen={noti ? true : false}
        msg={noti || ""}
        status={noti == "Create successfully" ? "success" : "error"}
        duration={3000}
        onClose={() => {}}
      />
    </Box>
  );
}
