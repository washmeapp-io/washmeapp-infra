import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { lambdaRole } from "../roles";

interface CreateLambdaParams {
  name: string;
  bucketId: string;
  bucketKey: string;
  provider: pulumi.ProviderResource;
}

export function createLambdaFunction(args: CreateLambdaParams) {
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

  return { lambda };
}
