import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as apiGatewayServicesResource from "./resources";
import * as apiGatewayServicesMethod from "./methods";
import * as apiGatewayServicesIntegrations from "./integrations";
import * as apiGatewayCommon from "../common";

interface CreateServicesAPIGatewayParams {
  name: string;
  handler: aws.lambda.Function;
  provider: pulumi.ProviderResource;
  userPool: aws.cognito.UserPool;
  env: string;
}

export function createServicesAPIGateway(args: CreateServicesAPIGatewayParams) {
  const { name, handler, provider, userPool, env } = args;
  const api = new aws.apigateway.RestApi(name, {}, { provider });

  // Create an API Gateway Authorizer using the Cognito User Pool
  const authorizer = new aws.apigateway.Authorizer("cognito-authorizer", {
    restApi: api,
    type: "COGNITO_USER_POOLS",
    identitySource: "method.request.header.Authorization",
    providerArns: [userPool.arn],
  });

  const { createCarwashResource } =
    apiGatewayServicesResource.createAPIGatewayResources({ api });
  const { createCarwashPostMethod } =
    apiGatewayServicesMethod.createAPIGatewayMethods({
      api: api,
      createCarwashResource: createCarwashResource,
      authorizer: authorizer,
    });
  apiGatewayServicesIntegrations.createAPIGatewayIntegrations({
    api: api,
    handler: handler,
    createCarwashResource: createCarwashResource,
    createCarwashPostMethod: createCarwashPostMethod,
  });

  // Enable API Gateway to invoke the Lambda function
  new aws.lambda.Permission(`${name}-api-lambda-permission`, {
    action: "lambda:InvokeFunction",
    function: handler.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`, // Allow invoking the function via any method on any path of this API
  });

  apiGatewayCommon.deployApiGateway({
    name: name,
    env,
    api,
    methods: [createCarwashPostMethod],
  });

  return api;
}
