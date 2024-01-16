import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { BucketObject } from "@pulumi/aws/s3";
import { ProviderResource } from "@pulumi/pulumi";

interface CreateLambdaParams {
  name: string;
  code: BucketObject;
  provider: ProviderResource;
}

export function createLambdaFunction(
  args: CreateLambdaParams
): aws.lambda.Function {
  const { name, code, provider } = args;
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
