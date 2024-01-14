import * as aws from "@pulumi/aws";

export const lambdaCode = new aws.s3.BucketObject("washmeapp-backend-code", {
  bucket: "washmeapp-backend-code",
});
