import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Device } from "@/app/utils/interfaces/device.interface";
import { Switch } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_DEVICE_MUTATION } from "@/app/api/device.api";
import Notification from "../notification/notification";

export default function DeviceCard({ device }: { device: Device }) {
  const [updateDeviceMutation, { error }] = useMutation(
    UPDATE_DEVICE_MUTATION
  );
  const [checked, setChecked] = React.useState(device.current_state == 1);
  const [status, setStatus] = React.useState<string>();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    try {
      const res = await updateDeviceMutation({
        variables: {
          input: {
            id: device.id,
            current_state: checked ? 1 : 0,
          },
        },
      });
      if (res.data) {
        setStatus("Update successful!");
      } else {
        setStatus("Update failed!" + (error?.message || ""));
      }
    } catch (error) {
      setStatus("Update failed!" + error);
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
          {/* <Box sx={{ width: "100%", height: 50 }}></Box> */}
          <Notification
            isOpen={status ? true : false}
            msg={status || ""}
            duration={200}
            status={status == "Update successful!" ? "success" : "error"}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
