import * as aws from "@pulumi/aws";

export function createDefaultProvider() {
  const usEast1Provider = new aws.Provider("us-east-1-provider", {
    region: "us-east-1",
  });

  return usEast1Provider;
}
