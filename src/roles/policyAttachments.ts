import * as aws from "@pulumi/aws";
import { lambdaRole } from "./roles";
import { Output } from "@pulumi/pulumi";

export function assignLambdaCognitoPolicy(userPoolArn: Output<string>) {
  // Define a policy document for accessing Cognito
  const cognitoPolicyDocument = aws.iam
    .getPolicyDocument({
      statements: [
        {
          effect: "Allow",
          actions: [
            "cognito-idp:AdminCreateUser",
            // Add any other Cognito actions your Lambda needs here
          ],
          resources: [
            // Replace with your Cognito User Pool ARN
            userPoolArn.get(),
          ],
        },
      ],
    })
    .then((policyDoc) => policyDoc.json);

  const cognitoPolicy = new aws.iam.Policy("cognitoAccessPolicy", {
    policy: cognitoPolicyDocument,
  });

  new aws.iam.RolePolicyAttachment("lambdaCognitoPolicyAttachment", {
    role: lambdaRole.name,
    policyArn: cognitoPolicy.arn,
  });
}
