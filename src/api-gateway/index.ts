import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import * as pulumi from "@pulumi/pulumi";

interface CreateAPIGatewayParams {
  name: string;
  handler: pulumi.Input<aws.lambda.Function>;
  provider: pulumi.ProviderResource;
}

export function createAPIGateway(args: CreateAPIGatewayParams) {
  const { name, handler, provider } = args;
  const api = new apigateway.RestAPI(
    name,
    {
      routes: [{ path: "/", method: "GET", eventHandler: handler }],
    },
    { provider }
  );

  return api;
}
