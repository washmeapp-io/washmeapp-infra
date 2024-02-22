import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";
import * as pulumi from "@pulumi/pulumi";

interface CreateAPIGatewayResourcesParams {
  api: RestApi;
}

export function createAPIGatewayResources(
  args: CreateAPIGatewayResourcesParams
) {
  const { api } = args;

  const usersResource = new aws.apigateway.Resource("user-resource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "users",
  });

  const loginResource = new aws.apigateway.Resource("login-resource", {
    restApi: api.id,
    parentId: usersResource.id,
    pathPart: "login",
  });

  return { usersResource, loginResource };
}
