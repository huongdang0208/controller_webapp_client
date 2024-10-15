import { gql } from "@apollo/client";

export const CREATE_DEVICE_MUTATION = gql`
  mutation Create_device($input: CreateDeviceInput!) {
    create_device(input: $input) {
      created_at
      current_state
      device_name
      id
      userID
    }
  }
`;

export const ALL_DEVICES_QUERY = gql`
  query All_devices($filter: DeviceQueryInput) {
    all_devices(filter: $filter) {
      items {
        id
        device_name
        current_state
        protocol
        created_at
        updated_at
        userID
      }
    }
  }
`;

export const CREATE_MANY_DEVICES_MUTATION = gql`
  mutation Create_devices($input: CreateDevicesInput!) {
    create_devices(input: $input) {
      items {
        userID
        id
        device_name
        protocol
        current_state
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_DEVICE_MUTATION = gql`
  mutation Update_device($input: UpdateItemInput!) {
    update_device(input: $input) {
      created_at
      current_state
      device_name
      id
      protocol
      updated_at
      userID
    }
  }
`;
