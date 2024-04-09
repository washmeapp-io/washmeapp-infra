import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { createAPIGatewayResources } from "./resources";
import { createAPIGatewayMethods } from "./methods";
import { createAPIGatewayIntegrations } from "./integrations";

interface CreateAPIGatewayParams {
  name: string;
  handler: aws.lambda.Function;
  provider: pulumi.ProviderResource;
  userPool: aws.cognito.UserPool;
}

export function createAPIGateway(args: CreateAPIGatewayParams) {
  const { name, handler, provider, userPool } = args;
  const api = new aws.apigateway.RestApi(name, {}, { provider });

  // Create an API Gateway Authorizer using the Cognito User Pool
  const authorizer = new aws.apigateway.Authorizer("cognito-authorizer", {
    restApi: api,
    type: "COGNITO_USER_POOLS",
    identitySource: "method.request.header.Authorization",
    providerArns: [userPool.arn],
  });

  const {verifyOTPResource, sendOTPResource, usersResource} = createAPIGatewayResources({api});
  const {getUsersMethod, verifyOTPPostMethod, sendOTPPostMethod} = createAPIGatewayMethods({
    api: api,
    authorizer: authorizer,
    sendOTPResource: sendOTPResource,
    verifyOTPResource: verifyOTPResource,
    usersResource: usersResource,
  });
  createAPIGatewayIntegrations({
    api: api,
    handler: handler,
    getUsersMethod: getUsersMethod,
    sendOTPPostMethod: sendOTPPostMethod,
    verifyOTPPostMethod: verifyOTPPostMethod,
    verifyOTPResource: verifyOTPResource,
    sendOTPResource: sendOTPResource,
    usersResource: usersResource,
  });

  // Enable API Gateway to invoke the Lambda function
  new aws.lambda.Permission("api-lambda-permission", {
    action: "lambda:InvokeFunction",
    function: handler.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`, // Allow invoking the function via any method on any path of this API
  });

  // Deploy the API to make it available - this trows an error in the automation
  // const deployment = new aws.apigateway.Deployment(
  //   "deployment",
  //   {
  //     restApi: api,
  //     stageName: "dev",
  //   },
  //   { dependsOn: [getUsersMethod, loginPostMethod] }
  // );

  //Set up a dev stage, which is an environment - this trows an error in the automation
  // new aws.apigateway.Stage("v1-stage", {
  //   restApi: api,
  //   deployment: deployment.id,
  //   stageName: "dev",
  // });

  return api;
}
