import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { Output, ProviderResource } from "@pulumi/pulumi";
import { Bucket, GetBucketResult } from "@pulumi/aws/s3";

interface CreateLambdaParams {
  name: string;
  bucketId: string;
  bucketKey: string;
  provider: ProviderResource;
}

export function createLambdaFunction(
  args: CreateLambdaParams
): aws.lambda.Function {
  const { name, bucketId, provider, bucketKey } = args;
  const lambda = new aws.lambda.Function(
    name,
    {
      runtime: aws.lambda.NodeJS12dXRuntime,
      handler: "index.handler",
      role: lambdaRole.arn,
      s3Bucket: bucketId,
      s3Key: bucketKey,
    },
    { provider }
  );

  return lambda;
}
