import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { Output, ProviderResource } from "@pulumi/pulumi";
import { Bucket } from "@pulumi/aws/s3";

interface CreateLambdaParams {
  name: string;
  bucket: Bucket;
  bucketKey: string;
  provider: ProviderResource;
}

export function createLambdaFunction(
  args: CreateLambdaParams
): aws.lambda.Function {
  const { name, bucket, provider, bucketKey } = args;
  const lambda = new aws.lambda.Function(
    name,
    {
      runtime: aws.lambda.NodeJS12dXRuntime,
      handler: "index.handler",
      role: lambdaRole.arn,
      s3Bucket: bucket.id,
      s3Key: bucketKey,
    },
    { provider }
  );

  return lambda;
}
