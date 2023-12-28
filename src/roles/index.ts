import * as aws from "@pulumi/aws";

export const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  }),
});

new aws.iam.RolePolicyAttachment("lambdaFullAccess", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
});
