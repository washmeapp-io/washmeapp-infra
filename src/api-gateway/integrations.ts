import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { createAPIGatewayMethods } from "./methods";
import { Authorizer, Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  loginResource: Resource;
  usersResource: Resource;
  getUsersMethod: Method;
  loginPostMethod: Method;
  handler: aws.lambda.Function;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams
) {
  const {
    api,
    loginResource,
    usersResource,
    getUsersMethod,
    loginPostMethod,
    handler,
  } = args;

  new aws.apigateway.Integration("get-users-method-integration", {
    restApi: api.id,
    resourceId: usersResource.id,
    httpMethod: getUsersMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  new aws.apigateway.Integration("login-post-method-integration", {
    restApi: api.id,
    resourceId: loginResource.id,
    httpMethod: loginPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  return api;
}
