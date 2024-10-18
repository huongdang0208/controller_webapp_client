import * as React from "react";
import mqtt from "mqtt";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Device } from "@/app/utils/interfaces/device.interface";
import { Switch } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_DEVICE_MUTATION } from "@/app/api/device.graphql";
import Notification from "../notification/notification";

export default function DeviceCard({
  device,
  mqttClient,
}: {
  device: Device;
  mqttClient: mqtt.MqttClient | null;
}) {
  const [updateDeviceMutation, { error }] = useMutation(UPDATE_DEVICE_MUTATION);
  const [checked, setChecked] = React.useState(device.current_state == 1);
  const [noti, setNoti] = React.useState<string>();

  // Update the checked state when the device prop changes
  React.useEffect(() => {
    setChecked(device.current_state == 1);
  }, [device]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    try {
      if (device?.protocol === "MQTT") {
        const topic = `hub/switches`;
        const message = `${checked ? "turn off" : "turn on"} - [state: ${
          checked ? 0 : 1
        }
        id: ${device.id}
        name: "${device.device_name}"
        ]`;
        mqttClient?.publish(topic, message);
      } else {
        const topic = `hub/lights`;
        const message = `${checked ? "turn off" : "turn on"} - [state: ${
          checked ? 0 : 1
        }
        id: ${device.id}
        name: "${device.device_name}"
        ]`;
        mqttClient?.publish(topic, message);
      }
      const res = await updateDeviceMutation({
        variables: {
          input: {
            id: device.id,
            current_state: event.target.checked ? 1 : 0,
          },
        },
      });
      if (res.data) {
        setNoti("Update successful!");
      } else {
        setNoti("Update failed!" + (error?.message || ""));
      }
    } catch (error) {
      setNoti("Update failed!" + error);
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
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
                {device.protocol}
              </Typography>
              <Chip
                size="small"
                color={checked ? "success" : "default"}
                label={checked ? "ON" : "OFF"}
              />
            </Stack>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Stack>
          <Notification
            isOpen={noti ? true : false}
            msg={noti || ""}
            duration={200}
            status={noti == "Update successful!" ? "success" : "error"}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
