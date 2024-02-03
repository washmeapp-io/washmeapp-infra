import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

interface CreateAPIGatewayParams {
  name: string;
  handler: aws.lambda.Function;
  provider: pulumi.ProviderResource;
}

export function createAPIGateway(args: CreateAPIGatewayParams) {
  const { name, handler, provider } = args;
  const api = new aws.apigateway.RestApi(name, {}, { provider });

  const getResource = new aws.apigateway.Resource("get-resource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "users",
  });

  const getMethod = new aws.apigateway.Method("get-method", {
    restApi: api.id,
    resourceId: getResource.id,
    httpMethod: "GET",
    authorization: "NONE",
  });

  new aws.apigateway.Integration("aws-integration", {
    restApi: api.id,
    resourceId: getResource.id,
    httpMethod: getMethod.httpMethod,
    type: "AWS_PROXY", // Integration type. AWS_PROXY for Lambda proxy integration
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  // Enable API Gateway to invoke the Lambda function
  new aws.lambda.Permission("api-lambda-permission", {
    action: "lambda:InvokeFunction",
    function: handler.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`, // Allow invoking the function via any method on any path of this API
  });

  // Deploy the API to make it available
  const deployment = new aws.apigateway.Deployment(
    "deployment",
    {
      restApi: api,
      stageName: "dev",
    },
    { dependsOn: [getMethod] }
  );

  //Set up a dev stage, which is an environment
  new aws.apigateway.Stage("v1-stage", {
    restApi: api,
    deployment: deployment.id,
    stageName: "dev",
  });

  return api;
}
