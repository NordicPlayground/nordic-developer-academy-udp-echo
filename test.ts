import udp from "node:dgram";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("UDP echo server", async (t) => {
  await t.step("the UDP server should echo a given string", async () => {
    const msg = `Hello World (${Date.now()})!`;

    const client = udp.createSocket("udp4");

    const received = await new Promise<string>((resolve, reject) => {
      const t = setTimeout(() => {
        reject(new Error(`Timeout!`));
        client.close();
      }, 5000);
      client.on("message", (msg: string) => {
        clearTimeout(t);
        resolve(msg.toString());
        client.close();
      });

      //sending msg
      client.send(msg, 2444, "localhost", () => {});
    });

    assertEquals(received.endsWith(msg), true);
  });
});
