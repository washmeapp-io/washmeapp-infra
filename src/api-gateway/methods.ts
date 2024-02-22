import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  authorizer: Authorizer;
  api: RestApi;
  loginResource: Resource;
  usersResource: Resource;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const { authorizer, api, loginResource, usersResource } = args;

  const getUsersMethod = new aws.apigateway.Method("get-users-method", {
    restApi: api.id,
    resourceId: usersResource.id,
    httpMethod: "GET",
    authorization: "COGNITO_USER_POOLS",
    authorizerId: authorizer.id,
  });

  const loginPostMethod = new aws.apigateway.Method("login-post-method", {
    restApi: api.id,
    resourceId: loginResource.id,
    httpMethod: "POST",
    authorization: "NONE",
  });

  return { getUsersMethod, loginPostMethod };
}
