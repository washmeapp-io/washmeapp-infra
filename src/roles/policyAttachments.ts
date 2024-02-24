import * as aws from "@pulumi/aws";
import { Role } from "@pulumi/aws/iam";
import { Output } from "@pulumi/pulumi";

export function assignLambdaCognitoPolicy(
  userPoolArn: Output<string>,
  lambdaRole: Role
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
}
