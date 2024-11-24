import * as React from "react";
import mqtt from "mqtt";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Device } from "@/app/utils/interfaces/device.interface";
import { Button, Switch } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import Popover from "@mui/material/Popover";

import { useMutation } from "@apollo/client";
import {
  UPDATE_DEVICE_MUTATION,
  DELETE_DEVICE_MUTATION,
} from "@/app/api/device.graphql";
import Notification from "../notification/notification";

export default function DeviceCard({
  device,
  mqttClient,
  setDeletedDevice,
  setSelectedDevice,
}: {
  device: Device;
  mqttClient: mqtt.MqttClient | null;
  setDeletedDevice: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
}) {
  const [updateDeviceMutation, { error }] = useMutation(UPDATE_DEVICE_MUTATION);
  const [deleteDeviceMutation] = useMutation(DELETE_DEVICE_MUTATION);
  const [checked, setChecked] = React.useState(device.current_state == 1);
  const [noti, setNoti] = React.useState<string | null>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Update the checked state when the device prop changes
  React.useEffect(() => {
    setChecked(device.current_state == 1);
  }, [device]);

  const handleExpandOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChecked(event.target.checked);
    if (device.current_state !== (event.target.checked ? 1 : 0)) {
      try {
        const res = await updateDeviceMutation({
          variables: {
            input: {
              id: device.id,
              current_state: event.target.checked ? 1 : 0,
            },
          },
        });
        if (res.data) {
          if (device?.protocol === "MQTT") {
            const topic = `hub/switches`;
            const message = `${checked ? "turn off" : "turn on"} - [id: ${device.id}, state: ${checked? 0: 1}, name: ${device.device_name}]`;
            // const message = `${checked ? "turn off" : "turn on"} - [state: ${
            //   checked ? 0 : 1
            // }
            // id: ${device.id}
            // name: "${device.device_name}"
            // ]`;
            mqttClient?.publish(topic, message);
          } else {
            const topic = `hub/lights`;
            const message = `${checked ? "turn off" : "turn on"} - [id: ${device.id}, state: ${checked? 0 : 1}, name: ${device.device_name}]`;
            // const message = `${checked ? "turn off" : "turn on"} - [state: ${
            //   checke? 0 : 1d
            // }
            // id: ${device.id}
            // name: "${device.device_name}"
            // ]`;
            mqttClient?.publish(topic, message);
          }
          setNoti("Update successful!");
        } else {
          setNoti("Update failed!" + (error?.message || ""));
        }
      } catch (error) {
        setNoti("Update failed!" + error);
      }
    }
  };

  const handleDeleteDevice = async () => {
    try {
      const topic = `hub/devices`;
      const message = `delete - [id: ${device.id}, protocol: ${device.protocol}, name: ${device.device_name}]`;
      mqttClient?.publish(topic, message);
      const res = await deleteDeviceMutation({
        variables: {
          input: {
            id: device.id,
          },
        },
      });
      if (res.data) {
        setNoti("Delete successful!");
        setDeletedDevice(device.id);
      } else {
        setNoti("Delete failed!" + (error?.message || ""));
      }
    } catch (error) {
      setNoti("Delete failed!" + error);
    }
  };

  const handleChangeSelectedDevice = () => {
    setSelectedDevice(device);
  };

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", flexGrow: 1, cursor: "pointer" }}
      onClick={handleChangeSelectedDevice}
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
        <Typography variant="h4" component="p">
          {device.device_name}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {device.protocol} - {device.pin}
              </Typography>
              <Chip
                size="small"
                color={checked ? "success" : "default"}
                label={checked ? "ON" : "OFF"}
              />
            </Stack>
            <Switch
              checked={checked}
              onChange={handleChangeStatus}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Stack>
          <Notification
            isOpen={!!noti}
            msg={noti || ""}
            duration={2000}
            status={noti === "Update successful!" ? "success" : "error"}
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
        <Button onClick={handleDeleteDevice} startIcon={<DeleteIcon />}>
          Delete this device
        </Button>
      </Popover>
    </Card>
  );
}
