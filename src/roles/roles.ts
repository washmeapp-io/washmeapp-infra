import * as aws from "@pulumi/aws";

const lambdaPolicy = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: "Allow",
      principals: [
        {
          type: "Service",
          identifiers: ["lambda.amazonaws.com"],
        },
      ],
      actions: ["sts:AssumeRole"],
    },
  ],
});

export const lambdaRole = new aws.iam.Role("lambda-role", {
  assumeRolePolicy: lambdaPolicy.then((assumeRole) => assumeRole.json),
});

new aws.iam.RolePolicy("lambda-log-policy", {
  role: lambdaRole.id,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Resource: "arn:aws:logs:*:*:*",
        Effect: "Allow",
      },
    ],
  }),
});
