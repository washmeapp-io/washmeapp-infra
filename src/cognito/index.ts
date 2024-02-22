import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

interface ICreateUserPool {
  userPoolName: string;
  userPoolClientName: string;
  trigger: aws.lambda.Function;
}

export function createUserPool(args: ICreateUserPool) {
  const { userPoolName, userPoolClientName, trigger } = args;
  // Create a Cognito User Pool
  const userPool = new aws.cognito.UserPool(userPoolName, {
    autoVerifiedAttributes: ["email"],
    lambdaConfig: {
      customMessage: trigger.arn,
    },
  });

  // Create a User Pool Client
  const userPoolClient = new aws.cognito.UserPoolClient(userPoolClientName, {
    userPoolId: userPool.id,
    generateSecret: false,
    // Recommended to enable the client to use the refresh token
    explicitAuthFlows: ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
  });

  new aws.lambda.Permission("allowCognitoToCallCustomMessageLambda", {
    action: "lambda:InvokeFunction",
    function: trigger.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
  });

  return { userPool, userPoolClient };
}
