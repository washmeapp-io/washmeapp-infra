import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  authorizer: Authorizer;
  api: RestApi;
  sendOTPResource: Resource;
  verifyOTPResource: Resource;
  usersResource: Resource;
  refreshSessionResource: Resource;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    authorizer,
    api,
    sendOTPResource,
    usersResource,
    verifyOTPResource,
    refreshSessionResource,
  } = args;

  const getUsersMethod = new aws.apigateway.Method("get-users-method", {
    restApi: api.id,
    resourceId: usersResource.id,
    httpMethod: "GET",
    authorization: "COGNITO_USER_POOLS",
    authorizerId: authorizer.id,
  });

  const sendOTPPostMethod = new aws.apigateway.Method("send-otp-post-method", {
    restApi: api.id,
    resourceId: sendOTPResource.id,
    httpMethod: "POST",
    authorization: "NONE",
  });

  const verifyOTPPostMethod = new aws.apigateway.Method(
    "verify-otp-post-method",
    {
      restApi: api.id,
      resourceId: verifyOTPResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    },
  );

  const refreshSessionPostMethod = new aws.apigateway.Method(
    "refresh-session-post-method",
    {
      restApi: api.id,
      resourceId: refreshSessionResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    },
  );

  return {
    getUsersMethod,
    sendOTPPostMethod,
    verifyOTPPostMethod,
    refreshSessionPostMethod,
  };
}
