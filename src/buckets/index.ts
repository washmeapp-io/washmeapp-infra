import * as aws from "@pulumi/aws";

import { ProviderResource } from "@pulumi/pulumi";

interface CreateBucketParams {
  name: string;
  provider: ProviderResource;
}

export function createBucket(args: CreateBucketParams) {
  const { name, provider } = args;
  const bucket = new aws.s3.Bucket(
    name,
    {
      bucket: name,
    },
    { provider: provider }
  );
  return bucket;
}

interface GetBucketParams {
  name: string;
}
export async function getBucket(
  args: GetBucketParams
): Promise<aws.s3.GetBucketResult> {
  const { name } = args;
  const bucket = await aws.s3.getBucket({
    bucket: name,
  });
  return bucket;
}

interface GetBucketObjectParams {
  bucketName: string;
  objectKey: string;
}
export async function getBucketObject(
  args: GetBucketObjectParams
): Promise<aws.s3.GetBucketObjectResult> {
  const { bucketName, objectKey } = args;
  const object = await aws.s3.getBucketObject({
    bucket: bucketName,
    key: objectKey,
  });
  return object;
}
