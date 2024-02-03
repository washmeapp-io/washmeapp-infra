import * as lambdaUtils from "./src/lambdas";
import * as apiGatewayUtils from "./src/api-gateway";
import * as utils from "./src/utils";

const provider = utils.createDefaultProvider();

const { lambda } = lambdaUtils.createLambdaFunction({
  name: "washmeapp-api-users",
  provider: provider,
  bucketKey: "users-api/code.zip",
  bucketId: "washmeapp-code",
});

const api = apiGatewayUtils.createAPIGateway({
  name: "users-api",
  handler: lambda,
  provider,
});

export const invoke = api.executionArn;
