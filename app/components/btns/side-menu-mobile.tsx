import * as React from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import MenuButton from "./menu-btn";
import MenuContent from "../menu-content";
// import CardAlert from "../card-alert";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/app/api/auth.graphql";
import { useAppSelector } from "@/app/lib/redux/store";
import Notification from "../notification/notification";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  setUrl: React.Dispatch<React.SetStateAction<string>>
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
  setUrl
}: SideMenuMobileProps) {
  const router = useRouter();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const authState = useAppSelector((state) => state.auth);
  const [noti, setNoti] = React.useState<string | null>();
  const handlerLogoutMutation = async () => {
    try {
      const data = await logoutMutation({
        variables: {
          params: {
            refreshToken: authState.refreshToken,
          },
        },
      });
      console.log("logout data: ", data);
      if (data?.data?.logout) {
        setNoti("Logout successful!");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      } else {
        setNoti("Logout failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={authState.user?.username}
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
              {authState.user?.username}
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent setUrl={setUrl} />
          <Divider />
        </Stack>
        {/* <CardAlert /> */}
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handlerLogoutMutation}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
      <Notification
        isOpen={!!noti}
        msg={noti || ""}
        duration={2000}
        status={noti === "Logout successful!" ? "success" : "error"}
        onClose={() => setNoti(null)}
      />
    </Drawer>
  );
}
