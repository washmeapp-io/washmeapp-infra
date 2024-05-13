import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";

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

  const carwashResource = new aws.apigateway.Resource("carwash-resource", {
    restApi: api.id,
    parentId: servicesResource.id,
    pathPart: "carwash",
  });

  const createCarwashResource = new aws.apigateway.Resource(
    "create-carwash-resource",
    {
      restApi: api.id,
      parentId: carwashResource.id,
      pathPart: "create",
    },
  );

  return { createCarwashResource, servicesResource };
}
