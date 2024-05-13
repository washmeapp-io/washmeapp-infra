import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  createCarwashResource: Resource;
  authorizer: Authorizer;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const { api, createCarwashResource, authorizer } = args;

  const createCarwashPostMethod = new aws.apigateway.Method(
    "create-carwash-post-method",
    {
      restApi: api.id,
      resourceId: createCarwashResource.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  return {
    createCarwashPostMethod,
  };
}
