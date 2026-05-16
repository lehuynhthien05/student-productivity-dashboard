import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export function connectToTasks(onEvent) {
  if (client) return;

  client = new Client({
    // use SockJS factory so it works across dev/prod
    webSocketFactory: () => new SockJS('/ws'),
    debug: () => {},
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/topic/tasks', (msg) => {
        try {
          const body = JSON.parse(msg.body);
          onEvent && onEvent(body);
        } catch (e) {
          // ignore
        }
      });
    }
  });

  client.activate();
}

export function disconnect() {
  if (!client) return;
  client.deactivate();
  client = null;
}
