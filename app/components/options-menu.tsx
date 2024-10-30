import * as React from 'react';
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { styled } from '@mui/system';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './btns/menu-btn';
import { LOGOUT_MUTATION } from '../api/auth.graphql';
import { useAppSelector } from '../lib/redux/store';
import Notification from './notification/notification';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const authState = useAppSelector((state) => state.auth);
  const [noti, setNoti] = React.useState<string | null>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Add another account</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <Divider />
        <MenuItem
          onClick={handlerLogoutMutation}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <Notification
        isOpen={!!noti}
        msg={noti || ''}
        duration={2000}
        status={noti === 'Logout successful!' ? 'success' : 'error'}
        onClose={() => setNoti(null)}
      />
    </React.Fragment>
  );
}