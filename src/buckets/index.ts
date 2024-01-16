import * as aws from "@pulumi/aws";
import { ProviderResource } from "@pulumi/pulumi";

interface CreateBucketParams {
  name: string;
  provider: ProviderResource;
}

export function createBucket(args: CreateBucketParams) {
  const { name, provider } = args;
  const bucket = new aws.s3.BucketObject(
    name,
    {
      bucket: name,
    },
    { provider: provider }
  );
  return bucket;
}
