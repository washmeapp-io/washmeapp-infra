import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";

export function assignLambdaPolicies(
  userPoolArn: Output<string>,
  lambdaRole: aws.iam.Role,
  cognitoSecret: aws.secretsmanager.Secret
) {
  // Attach policy for Cognito
  userPoolArn.apply((arn) => {
    aws.iam
      .getPolicyDocument({
        statements: [
          {
            effect: "Allow",
            actions: ["cognito-idp:AdminCreateUser"],
            resources: [arn],
          },
        ],
      })
      .then((policyDoc) => {
        const cognitoPolicy = new aws.iam.Policy("cognitoAccessPolicy", {
          policy: policyDoc.json,
        });

        new aws.iam.RolePolicyAttachment("lambdaCognitoPolicyAttachment", {
          role: lambdaRole.name,
          policyArn: cognitoPolicy.arn,
        });
      });
  });

  // Attach policy for Secrets Manager
  cognitoSecret.arn.apply((arn) => {
    aws.iam
      .getPolicyDocument({
        statements: [
          {
            effect: "Allow",
            actions: ["secretsmanager:GetSecretValue"],
            resources: [arn],
          },
        ],
      })
      .then((policyDoc) => {
        const secretAccessPolicy = new aws.iam.Policy("secretAccessPolicy", {
          policy: policyDoc.json,
        });

        new aws.iam.RolePolicyAttachment("secretAccessPolicyAttachment", {
          role: lambdaRole.name,
          policyArn: secretAccessPolicy.arn,
        });
      });
  });
}
