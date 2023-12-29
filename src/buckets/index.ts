import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export const lambdaCode = new aws.s3.BucketObject("washmeapp-backend-code", {
  bucket: "myBucket", // replace this with your bucket name
  source: new pulumi.asset.RemoteArchive(
    "https://github.com/user/repo/archive/refs/heads/main.zip"
  ),
});
