import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

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

interface LambdaCodeUploadParams {
  bucket: aws.s3.Bucket;
  filePath: string;
}

export function uploadLambdaCode(args: LambdaCodeUploadParams) {
  const { bucket, filePath } = args;

  // Upload the ZIP file to S3
  const lambdaCode = new aws.s3.BucketObject("lambda-code", {
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset(filePath),
  });

  return lambdaCode;
}
