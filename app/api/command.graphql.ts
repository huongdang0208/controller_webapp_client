import { gql } from "@apollo/client";

export const COMMANDS_BY_DEVICE_QUERY = gql`
  query Commands_by_device($deviceId: Float!) {
    commands_by_device(deviceID: $deviceId) {
      commands {
        command
        created_at
        deviceID
        id
        receiver
        sender
        userID
      }
    }
  }
`;

export const ANALYZE_COMMANDS_QUERY = gql`
  query Analyze_commands_by_device($deviceId: Float!) {
    analyze_commands_by_device(deviceID: $deviceId) {
      days
      hoursPerDay {
        seconds
        minutes
        hours
      }
    }
  }
`;
