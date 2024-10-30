import { gql } from "@apollo/client";

export const CREATE_TIMER_MUTATION = gql`
  mutation Create_timer($input: CreateTimerInput!) {
    create_timer(input: $input) {
      action
      created_at
      date
      deviceID
      id
      time
      userID
      status
    }
  }
`;

export const ALL_TIMER_QUERY = gql`
  query All_timers($userId: Float!) {
    all_timers(userId: $userId) {
      timers {
        action
        created_at
        date
        deviceID
        id
        time
        userID
        status
      }
    }
  }
`;

export const UPDATE_TIMER_MUTATION = gql`
  mutation Update_timer($input: UpdateTimerInput!) {
    update_timer(input: $input) {
      action
      created_at
      date
      deviceID
      id
      status
      time
      userID
    }
  }
`;

export const UPDATE_TIMER_STATUS_MUTATION = gql`
  mutation Update_timer_status($input: UpdateTimerStatusInput!) {
    update_timer_status(input: $input) {
      action
      created_at
      date
      deviceID
      id
      status
      time
      userID
    }
  }
`;

export const DELETE_TIMER_MUTATION = gql`
  mutation Delete_timer($timerId: Float!) {
    delete_timer(timerID: $timerId)
  }
`;
