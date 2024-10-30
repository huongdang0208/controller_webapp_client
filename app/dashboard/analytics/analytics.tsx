"use client"
import * as React from "react";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect } from "react";
import Copyright from "@/app/components/main-grid/copy-rights";
import { Device } from "@/app/utils/interfaces/device.interface";
import { ANALYZE_COMMANDS_QUERY } from "@/app/api/command.graphql";
import { AnalyticsCommand } from "@/app/utils/interfaces/command.interface";

export default function Analytics({ listDevices }: { listDevices: Device[] }) {
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(
    null
  );
  const { data, error, refetch } = useQuery(ANALYZE_COMMANDS_QUERY, {
    variables: {
      deviceId: selectedDevice?.id,
    },
  });
  const [analytics, setAnalytics] = React.useState<AnalyticsCommand | null>(
    null
  );
  const [dataset, setDataset] = React.useState<{x: Date, y: number}[]>([]);

  const handleChooseDevice = (event: SelectChangeEvent) => {
    const deviceName = event.target.value;
    setSelectedDevice(
      listDevices?.find(
        (device: Device) => device.device_name === deviceName
      ) || null
    );
  };

  useEffect(() => {
    if (selectedDevice) {
      refetch();
    }
    if (error) {
      console.error(error);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (data?.analyze_commands_by_device?.days && data?.analyze_commands_by_device?.hoursPerDay) {
      setAnalytics(data.analyze_commands_by_device);
    }
    if (analytics) {
      const data = analytics.days?.map((day, index) => ({
        x: new Date(day),
        y: calculateTotalHours(analytics?.hoursPerDay[index]),
      }));
      setDataset(data);
    }
    console.log(selectedDevice?.device_name)
    console.log(dataset);
  }, [data]);

  const calculateTotalHours = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return time.hours + time.minutes / 60 + time.seconds / 3600;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Select device to view analytics
      </Typography>

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
      {selectedDevice && analytics && (
        <LineChart
          dataset={dataset}
          xAxis={[
            {
              scaleType: "time",
              data: dataset?.map((data) => data.x),
              valueFormatter: (value) =>
                value instanceof Date ? value.toLocaleDateString() : value,
            },
          ]}
          series={[{ dataKey: "y" }]}
          width={800}
          height={300}
        />
      )}
      {!data?.analyze_commands_by_device?.days || !data?.analyze_commands_by_device?.hoursPerDay && (
        <Typography component="p" variant="body2">
          No data available
        </Typography>
      )}
      <Copyright />
    </Box>
  );
}
