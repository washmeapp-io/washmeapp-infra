import * as aws from "@pulumi/aws";
import { lambdaRole } from "./roles";
import { Output } from "@pulumi/pulumi";

export function assignLambdaCognitoPolicy(
  userPoolArn: Output<string>,
  lambdaRoleName: string
) {
  userPoolArn.apply((arn) => {
    const cognitoPolicyDocument = aws.iam
      .getPolicyDocument({
        statements: [
          {
            effect: "Allow",
            actions: [
              "cognito-idp:AdminCreateUser",
              // Add any other Cognito actions your Lambda needs here
            ],
            resources: [arn],
          },
        ],
      })
      .then((policyDoc) => policyDoc.json);

    const cognitoPolicy = new aws.iam.Policy("cognitoAccessPolicy", {
      policy: cognitoPolicyDocument,
    });

    cognitoPolicy.arn.apply((policyArn) => {
      new aws.iam.RolePolicyAttachment("lambdaCognitoPolicyAttachment", {
        role: lambdaRoleName,
        policyArn: policyArn,
      });
    });
  });
}
