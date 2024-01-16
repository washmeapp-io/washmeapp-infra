import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { BucketObject } from "@pulumi/aws/s3";
import { ProviderResource } from "@pulumi/pulumi";

export function createLambdaFunction({
  name,
  code,
  provider,
}: {
  name: string;
  code: BucketObject;
  provider: ProviderResource;
}): aws.lambda.Function {
  const lambda = new aws.lambda.Function(
    name,
    {
      runtime: aws.lambda.NodeJS12dXRuntime,
      handler: "index.handler",
      role: lambdaRole.arn,
      code,
    },
    { provider }
  );

  return lambda;
}
