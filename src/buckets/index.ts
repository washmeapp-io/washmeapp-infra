import * as aws from "@pulumi/aws";

export function createBucket({ name }: { name: string }) {
  const bucket = new aws.s3.BucketObject("washmeapp-backend-code", {
    bucket: name,
  });
  return bucket;
}
