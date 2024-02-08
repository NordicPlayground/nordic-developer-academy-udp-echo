import { ipv4, ipv6 } from "./ip.ts";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("ip.ts", async (t) => {
  await t.step(`ipv4`, async () =>
    assertEquals(await ipv4("localhost"), ["127.0.0.1"])
  );
  await t.step(`ipv6`, async () =>
    assertEquals(await ipv6("localhost"), ["::1"])
  );
});
