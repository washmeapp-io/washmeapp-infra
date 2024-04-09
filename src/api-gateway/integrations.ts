import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { createAPIGatewayMethods } from "./methods";
import { Authorizer, Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  sendOTPResource: Resource;
  verifyOTPResource: Resource;
  usersResource: Resource;
  getUsersMethod: Method;
  sendOTPPostMethod: Method;
  verifyOTPPostMethod: Method
  handler: aws.lambda.Function;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams
) {
  const {
    api,
    sendOTPResource,
    verifyOTPResource,
    verifyOTPPostMethod,
    usersResource,
    getUsersMethod,
    sendOTPPostMethod,
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

  new aws.apigateway.Integration("send-otp-post-method-integration", {
    restApi: api.id,
    resourceId: sendOTPResource.id,
    httpMethod: sendOTPPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  new aws.apigateway.Integration("verify-otp-post-method-integration", {
    restApi: api.id,
    resourceId: verifyOTPResource.id,
    httpMethod: verifyOTPPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  return api;
}
