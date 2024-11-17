import { useEffect, useState } from "react";
import mqtt from "mqtt";

interface Payload {
  topic: string;
  message: string;
}
// host: string, mqttOptions: mqtt.IClientOptions
const useMQTTClient = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("disconnected");
  const [payload, setPayload] = useState<Payload | null>(null);

  const mqttConnect = () => {
    const host = process.env.MQTT_BROKER || "wss://gdd851ff.ala.asia-southeast1.emqxsl.com:8084/mqtt";
    const mqttOptions: mqtt.IClientOptions = {
      clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
      username: process.env.MQTT_USERNAME || "thuhuong",
      password: process.env.MQTT_PASSWORD || "thuhuong",
      protocol: 'wss'
    };
    setConnectStatus("connecting");
    setClient(mqtt.connect(host, mqttOptions));
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("connected");
      });
    }
    client?.on("error", (error) => {
      console.error("MQTT error", error);
      client.end();
    });
    client?.on("reconnect", () => {
      setConnectStatus("reconnecting");
    });
    client?.on("message", (topic, message) => {
      const payload = { topic, message: message?.toString() };
      console.log("payload in hook: ", payload);
      setPayload(payload);
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);
  return { client, connectStatus, payload, mqttConnect };
};
export default useMQTTClient;
