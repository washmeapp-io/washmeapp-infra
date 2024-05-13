import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { createAPIGatewayMethods } from "./methods";
import { Authorizer, Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  createCarwashResource: Resource;
  createCarwashPostMethod: Method;
  handler: aws.lambda.Function;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams,
) {
  const { api, createCarwashResource, createCarwashPostMethod, handler } = args;

  new aws.apigateway.Integration("create-carwash-method-integration", {
    restApi: api.id,
    resourceId: createCarwashResource.id,
    httpMethod: createCarwashPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  return api;
}
