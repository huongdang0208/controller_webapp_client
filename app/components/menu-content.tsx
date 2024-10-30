import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, url: "/dashboard" },
  {
    text: "Analytics",
    icon: <AnalyticsRoundedIcon />,
    url: "/dashboard/analytics",
  },
  { text: "Timer", icon: <AvTimerIcon />, url: "/dashboard/timer" },
  { text: "Tasks", icon: <AssignmentRoundedIcon />, url: "/dashboard/tasks" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, url: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, url: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, url: "/feedback" },
];

export default function MenuContent({
  setUrl,
}: {
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleChangeURL = (url: string) => () => {
    setUrl(url);
  };
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={index === 0}
              onClick={handleChangeURL(item.url)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
