export const typedefs = `#graphql
type AuthRegisterResponse {
  message: String
  node: RegisterResponse
}

type CommandResponse {
  command: String!
  created_at: Timestamp!
  deviceID: Float!
  id: Float!
  receiver: String
  sender: String
  userID: Float!
}

input CreateDeviceInput {
  current_state: Float!
  device_name: String!
  id_address: Float
  user_id: Float
}

input DeviceQueryInput {
  userID: Int!
}

type DeviceResponse {
  created_at: String
  current_state: Float
  device_name: String!
  id: Float!
  userID: Float!
}

type DevicesResponse {
  items: [DeviceResponse!]!
  paginateInfo: PaginateInfo
}

input LoginInput {
  password: String!
  username: String!
}

type LoginResponse {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type LoginResponseBlock {
  message: String
  node: LoginResponse
}

input LogoutInput {
  refreshToken: String!
}

type LogoutResponseBlock {
  message: String
}

type Mutation {
  create_device(input: CreateDeviceInput!): DeviceResponse!
  login(loginAuthenticateInput: LoginInput!): LoginResponseBlock!
  logout(params: LogoutInput!): LogoutResponseBlock!
  refresh_token(params: RefreshTokenInput!): LoginResponseBlock!
  register(params: RegisterAuthenticateInput!): AuthRegisterResponse!
  update_device(id: Float!, input: UpdateItemInput!): DeviceResponse!
}

type PaginateInfo {
  currentPage: Float
  totalCount: Float!
  totalPage: Float!
}

type Query {
  all_devices(filter: DeviceQueryInput): DevicesResponse!
  command(userID: Float!): CommandResponse!
  me: User!
}

input RefreshTokenInput {
  refreshToken: String!
}

input RegisterAuthenticateInput {
  email: String!
  password: String!
  username: String!
}

type RegisterResponse {
  user: User!
}

scalar Timestamp

input UpdateItemInput {
  current_state: Float!
  device_name: String!
  id_address: Float
  user_id: Float
}

type User {
  created_date: String
  email: String!
  id: Float!
  modify_date: String
  username: String!
}`;
