export interface Command {
    id: number;
    userID: number;
    deviceID: number;
    command: string;
    created_at: string;
    sender?: string;
    receiver?: string;
}

export interface AnalyticsCommand {
    days: Date[];
    hoursPerDay: { hours: number, minutes: number, seconds: number }[];
}