import * as aws from "@pulumi/aws";
import { ProviderResource } from "@pulumi/pulumi";

export function createBucket({
  name,
  provider,
}: {
  name: string;
  provider: ProviderResource;
}) {
  const bucket = new aws.s3.BucketObject(
    "washmeapp-backend-code",
    {
      bucket: name,
    },
    { provider: provider }
  );
  return bucket;
}
