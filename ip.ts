const resolveHostname =
  (recordType: "A" | "AAAA") =>
  async (hostname: string): Promise<string[]> => {
    const aRecords = await Deno.resolveDns(hostname, recordType);
    if (aRecords.length > 0) return aRecords;
    const cname = await Deno.resolveDns(hostname, "CNAME");
    const cnameIps = (
      await Promise.all(
        cname.map((cname) => {
          try {
            return resolveHostname(recordType)(cname);
          } catch {
            return null;
          }
        })
      )
    )
      .flat()
      .filter((ip): ip is string => ip !== null);

    if (cnameIps.length > 0) return cnameIps;
    throw new Error(`Could not determine ${recordType} for ${hostname}!`);
  };

export const ipv4 = resolveHostname("A");
export const ipv6 = resolveHostname("AAAA");
