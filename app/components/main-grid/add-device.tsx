import * as React from "react";
import mqtt from "mqtt";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel } from "@mui/material";
import Input from "@mui/material/Input";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "@apollo/client";
import { CREATE_DEVICE_MUTATION } from "@/app/api/device.graphql";
import { useAppSelector } from "@/app/lib/redux/store";
import { Device } from "@/app/utils/interfaces/device.interface";

export default function AddDevice({
  listDevices,
  setListDevices,
  mqttClient,
}: {
  listDevices: Device[];
  setListDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  mqttClient: mqtt.MqttClient | null;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const authState = useAppSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [protocol, setProtocol] = React.useState("");
  const [deviceName, setDeviceName] = React.useState("");
  const [createDeviceMutation, { error }] = useMutation(CREATE_DEVICE_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDeviceName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeviceName(event.target.value);
  };

  const handleChangeProtocol = (event: SelectChangeEvent) => {
    setProtocol(event.target.value as string);
  };

  const handleCreateDevice = async () => {
    console.log("Creating device", deviceName, protocol);
    try {
      const res = await createDeviceMutation({
        variables: {
          input: {
            device_name: deviceName,
            protocol: protocol,
            userID: authState.user?.id,
            current_state: 0,
            pin: 0,
          },
        },
      });
      if (res.data) {
        console.log("Device created", res.data);
        setListDevices([...listDevices, res.data.create_device]);
        handleClose();
        const topic = `hub/devices`;
        const message = `add - [id: ${res.data.create_device.id}, protocol: ${res.data.create_device.protocol}, name: ${res.data.create_device.device_name}]`;
        mqttClient?.publish(topic, message);
      }
      if (error) {
        console.error("Error creating device", error);
      }
    } catch (err) {
      console.error("Error creating device", err);
    }
  };

  return (
    // <Card sx={{ height: "100%" }}>
    // <CardContent>
    <>
      {/* <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
      >
        Add more devices
      </Typography> */}
      <Button
        variant="contained"
        size="small"
        color="primary"
        endIcon={<AddIcon />}
        fullWidth={isSmallScreen}
        onClick={handleClickOpen}
      >
        Add device
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ width: "100%", minWidth: "700px", margin: "auto" }}
      >
        <DialogTitle id="alert-dialog-title">{"Add new device"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="device-name">Device name</InputLabel>
            <Input
              id="device-name"
              value={deviceName}
              onChange={handleChangeDeviceName}
              aria-describedby="device-name-helper"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="protocol-select-label">Protocol</InputLabel>
            <Select
              labelId="protocol-select-label"
              id="protocol-select"
              value={protocol}
              label="Protocol"
              onChange={handleChangeProtocol}
            >
              <MenuItem value={"BLE"}>Bluetooth</MenuItem>
              <MenuItem value={"MQTT"}>MQTT</MenuItem>
              <MenuItem value={"ZIGBEE"}>Zigbee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateDevice} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
    //   </CardContent>
    // </Card>
  );
}
