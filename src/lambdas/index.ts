import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";

export function createLambdaFunction(name: string): aws.lambda.Function {
  const lambda = new aws.lambda.Function(name, {
    runtime: aws.lambda.NodeJS12dXRuntime,
    handler: "index.handler",
    role: lambdaRole.arn,
  });

  return lambda;
}
