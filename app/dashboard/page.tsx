"use client";
import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useRouter } from "next/navigation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../components/bar/nav-bar";
import Header from "../components/header/header";
import MainGrid from "../components/main-grid/main-grid";
import SideMenu from "../components/side-menu/side-menu";
import AppTheme from "../components/theme/app-theme";
import {
  // chartsCustomizations,
  dataGridCustomizations,
  // treeViewCustomizations,
} from "./custom/data-grid";
import { useMutation, useQuery } from "@apollo/client";
import { datePickersCustomizations } from "./custom/date-picker";
import { useAppSelector } from "../lib/redux/store";
import { User } from "../utils/interfaces/user.interface";
import { useEffect } from "react";
import {
  CREATE_MANY_DEVICES_MUTATION,
  ALL_DEVICES_QUERY,
  UPDATE_DEVICE_MUTATION,
} from "../api/device.graphql";
import { Device, DeviceQueryInput } from "../utils/interfaces/device.interface";
import Notification from "../components/notification/notification";
import useMQTTClient from "../lib/mqtt/useMQTTClient";

const xThemeComponents = {
  // ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  // ...treeViewCustomizations,
};

export default function Dashboard() {
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  const { client, connectStatus, payload, mqttConnect } = useMQTTClient();
  const [createManyDevicesMutation] = useMutation(CREATE_MANY_DEVICES_MUTATION);
  const { error, data, refetch } = useQuery(ALL_DEVICES_QUERY, {
    variables: {
      filter: {
        userID: authState.user?.id,
      },
    },
  });
  const [updateDeviceMutation] = useMutation(UPDATE_DEVICE_MUTATION);
  const [listDevices, setListDevices] = React.useState<Device[]>(
    data?.all_devices.items
  );
  const devices = [
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 1",
      current_state: 0,
      protocol: "BLE",
      pin: 1,
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 2",
      current_state: 0,
      protocol: "BLE",
      pin: 2,
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 3",
      current_state: 0,
      protocol: "BLE",
      pin: 3,
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 1",
      current_state: 0,
      protocol: "MQTT",
      pin: 4,
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 2",
      current_state: 0,
      protocol: "MQTT",
      pin: 5,
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 3",
      current_state: 0,
      protocol: "MQTT",
      pin: 6,
    },
  ];

  useEffect(() => {
    mqttConnect();
    console.log("mqtt status: ", connectStatus);
  }, []);

  useEffect(() => {
    if (client) {
      client.subscribe("hub/lights");
      client.subscribe("hub/switches");
    }
    console.log("payload: ", payload?.message);
    if (payload) {
      handleReceiveMessage(payload.message);
    }
  }, [client, connectStatus, payload]);

  const handleReceiveMessage = async (message: string) => {
    // Split the message to get the action and the data part
    const [actionPart, dataPart] = message.split(" - ");

    // Extract the action
    const action = actionPart.trim();

    // Use a regular expression to find the id
    const idMatch = dataPart.match(/id:\s*(\d+)/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;
    try {
      const res = await updateDeviceMutation({
        variables: {
          input: {
            id,
            current_state: action === "turn on" ? 1 : 0,
          },
        },
      });
      if (res.data) {
        setListDevices((prev) => {
          const updatedDevices = prev.map((device) =>
            device.id === id
              ? { ...device, current_state: action === "turn on" ? 1 : 0 }
              : device
          );
          return [...updatedDevices]; // Ensure a new array reference
        });
        refetch({
          filter: {
            userID: authState.user?.id,
          },
        });
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const createDevicesHandler = async (devices: DeviceQueryInput[]) => {
    try {
      const res = await createManyDevicesMutation({
        variables: {
          input: {
            devices,
          },
        },
      });
      if (res.data) {
        setListDevices(res.data.create_devices.items);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  useEffect(() => {
    if (data) {
      setListDevices(data.all_devices.items);
    }
  }, [data, setListDevices]);

  useEffect(() => {
    if (!authState.user) {
      router.push("/sign-in");
    } else if (data?.all_devices.items.length === 0) {
      createDevicesHandler(devices);
    }
  }, [router, authState.user, data]);

  if (!authState.user) {
    return null; // or a loading spinner
  }

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu user={authState.user as User} />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme: Theme) => ({
            flexGrow: 1,
            backgroundColor: `rgba(${theme.palette.background.default} / 1)`,
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid listDevices={listDevices} mqttClient={client} />
          </Stack>
        </Box>
      </Box>
      <Notification
        isOpen={error ? true : false}
        msg={error ? JSON.stringify(error) : ""}
        status={error ? "error" : "success"}
        duration={3000}
      />
    </AppTheme>
  );
}
