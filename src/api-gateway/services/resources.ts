import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";
import * as pulumi from "@pulumi/pulumi";

interface CreateAPIGatewayResourcesParams {
  api: RestApi;
}

export function createAPIGatewayResources(
  args: CreateAPIGatewayResourcesParams,
) {
  const { api } = args;

  const servicesResource = new aws.apigateway.Resource("services-resource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "services",
  });

  const createCarwashResource = new aws.apigateway.Resource(
    "create-carwash-resource",
    {
      restApi: api.id,
      parentId: servicesResource.id,
      pathPart: "create",
    },
  );

  return { createCarwashResource, servicesResource };
}