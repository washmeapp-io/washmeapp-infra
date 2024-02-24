import * as aws from "@pulumi/aws";
import { Role } from "@pulumi/aws/iam";
import { Secret } from "@pulumi/aws/secretsmanager";
import { Output } from "@pulumi/pulumi";

export function assignLambdaPolicies(
  userPoolArn: Output<string>,
  lambdaRole: Role,
  cognitoSecret: Secret
) {
  userPoolArn.apply((arn) => {
    const cognitoPolicyDocument = aws.iam
      .getPolicyDocument({
        statements: [
          {
            effect: "Allow",
            actions: ["cognito-idp:AdminCreateUser"],
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
        role: lambdaRole,
        policyArn: policyArn,
      });
    });
  });

  cognitoSecret.arn.apply((arn) => {
    const secretAccessPolicyDocument = aws.iam
      .getPolicyDocument({
        statements: [
          {
            effect: "Allow",
            actions: ["secretsmanager:GetSecretValue"],
            resources: [arn],
          },
        ],
      })
      .then((policyDoc) => policyDoc.json);

    const secretAccessPolicy = new aws.iam.Policy("secretAccessPolicy", {
      policy: secretAccessPolicyDocument,
    });

    new aws.iam.RolePolicyAttachment("secretAccessPolicyAttachment", {
      role: lambdaRole.name,
      policyArn: secretAccessPolicy.arn,
    });
  });
}
