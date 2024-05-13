import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayResourcesParams {
  api: RestApi;
}

export function createAPIGatewayResources(
  args: CreateAPIGatewayResourcesParams,
) {
  const { api } = args;

  const usersResource = new aws.apigateway.Resource("user-resource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "users",
  });

  const sendOTPResource = new aws.apigateway.Resource("send-otp-resource", {
    restApi: api.id,
    parentId: usersResource.id,
    pathPart: "send-otp",
  });

  const verifyOTPResource = new aws.apigateway.Resource("verify-otp-resource", {
    restApi: api.id,
    parentId: usersResource.id,
    pathPart: "verify-otp",
  });

  const refreshSessionResource = new aws.apigateway.Resource(
    "refresh-session-resource",
    {
      restApi: api.id,
      parentId: usersResource.id,
      pathPart: "refresh-session",
    },
  );

  return { sendOTPResource, verifyOTPResource, refreshSessionResource };
}
