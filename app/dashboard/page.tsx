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
} from "../api/device.api";
import { Device, DeviceQueryInput } from "../utils/interfaces/device.interface";
import Notification from "../components/notification/notification";

const xThemeComponents = {
  // ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  // ...treeViewCustomizations,
};

export default function Dashboard() {
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  const [createManyDevicesMutation] = useMutation(CREATE_MANY_DEVICES_MUTATION);
  const { error, data } = useQuery(ALL_DEVICES_QUERY, {
    variables: {
      filter: {
        userID: authState.user?.id,
      },
    },
  });
  const [listDevices, setListDevices] = React.useState<Device[]>(
    data?.all_devices.items
  );
  const devices = [
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 1",
      current_state: 0,
      protocol: "ble",
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 2",
      current_state: 0,
      protocol: "ble",
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Light 3",
      current_state: 0,
      protocol: "ble",
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 1",
      current_state: 0,
      protocol: "mqtt",
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 2",
      current_state: 0,
      protocol: "mqtt",
    },
    {
      userID: authState.user?.id ? authState.user.id : 0,
      device_name: "Switch 3",
      current_state: 0,
      protocol: "mqtt",
    },
  ];

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
  }, [data]);

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
            <MainGrid listDevices={listDevices} />
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
