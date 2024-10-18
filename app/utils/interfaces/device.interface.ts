export interface Device {
    id: number;
    userID: number;
    device_name: string;
    current_state: number;
    created_date: string;
    updated_date: string;
    id_address: string;
    protocol: string;
    pin: number;
}

export interface DeviceQueryInput {
    userID: number;
    device_name: string;
    current_state: number;
    protocol: string;
    pin: number;
}