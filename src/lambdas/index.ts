import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { ProviderResource } from "@pulumi/pulumi";

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
      runtime: "nodejs18.x",
      handler: "index.handler",
      role: lambdaRole.arn,
      s3Bucket: bucketId,
      s3Key: bucketKey,
    },
    { provider }
  );

  return lambda;
}
