import udp from "node:dgram";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

const hostname = Deno.env.get("HOSTNAME") ?? "localhost";
const proto = Deno.env.get("PROTO") ?? "udp4";
const protos = ["udp4", "udp6"];
if (!protos.includes(proto))
  throw new Error(`PROTO must be one of ${protos.join(", ")}!`);
const port = 2444;

Deno.test("UDP echo server", async (t) => {
  await t.step(
    `the UDP server at ${hostname}:${port} (${proto}) should echo a given string`,
    async () => {
      const msg = `Hello World (${Date.now()})!`;

      const client = udp.createSocket(proto as udp.SocketType);

      const received = await new Promise<string>((resolve, reject) => {
        const t = setTimeout(() => {
          reject(new Error(`Timeout!`));
          client.close();
        }, 5000);
        client.on("message", (msg: string) => {
          clearTimeout(t);
          console.log(`<`, msg.toString());
          resolve(msg.toString());
          client.close();
        });

        console.log(`>`, msg);
        client.send(msg, port, hostname, () => {});
      });

      assertEquals(received.endsWith(msg), true);
    }
  );
});
