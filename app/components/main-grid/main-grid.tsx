import * as React from "react";
import mqtt from "mqtt";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "./copy-rights";
// import ChartUserByCountry from './ChartUserByCountry';
// import CustomizedTreeView from './CustomizedTreeView';
// import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from "./add-device";
import { Device } from "@/app/utils/interfaces/device.interface";
import DeviceCard from "./device-card";

export default function MainGrid({
  listDevices,
  setListDevices,
  mqttClient,
}: {
  listDevices: Device[];
  setListDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  mqttClient: mqtt.MqttClient | null;
}) {
  const [deletedDevice, setDeletedDevice] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (deletedDevice) {
      setListDevices(listDevices.filter((device) => device.id !== deletedDevice));
    }
  }, [deletedDevice]);
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {listDevices?.map((device: Device, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <DeviceCard device={device} mqttClient={mqttClient} setDeletedDevice={setDeletedDevice} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>{/* <HighlightedCard /> */}</Grid>
        <Grid size={{ sm: 12, md: 6 }}>{/* <SessionsChart /> */}</Grid>
        <Grid size={{ sm: 12, md: 6 }}>{/* <PageViewsBarChart /> */}</Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard listDevices={listDevices} setListDevices={setListDevices} mqttClient={mqttClient} />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {/* <HighlightedCard /> */}
        </Grid>
      </Grid>
      <Copyright />
    </Box>
  );
}
