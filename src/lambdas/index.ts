import * as aws from "@pulumi/aws";
import { lambdaRole } from "../roles";
import { Output, ProviderResource } from "@pulumi/pulumi";

interface CreateLambdaParams {
  name: string;
  bucketName: Output<string>;
  codeObjectKey: string;
  provider: ProviderResource;
}

export function createLambdaFunction(
  args: CreateLambdaParams
): aws.lambda.Function {
  const { name, bucketName, codeObjectKey, provider } = args;
  const lambda = new aws.lambda.Function(
    name,
    {
      runtime: aws.lambda.NodeJS12dXRuntime,
      handler: "index.handler",
      role: lambdaRole.arn,
      code: {
        s3Bucket: bucketName,
        s3Key: codeObjectKey,
      },
    },
    { provider }
  );

  return lambda;
}
