import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { BucketObject } from "@pulumi/aws/s3";

export function createLambdaFunction(
  name: string,
  code: BucketObject
): aws.lambda.Function {
  const lambda = new aws.lambda.Function(name, {
    runtime: aws.lambda.NodeJS12dXRuntime,
    handler: "index.handler",
    role: lambdaRole.arn,
    code,
  });

  return lambda;
}
