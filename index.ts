import * as aws from "@pulumi/aws";

import * as lambdaUtils from "./src/lambdas";
import * as apiGatewayUtils from "./src/api-gateway";
import * as cognitoUtils from "./src/cognito";
import * as utils from "./src/utils";
import { assignLambdaCognitoPolicy } from "./src/roles/policyAttachments";

const provider = utils.createDefaultProvider();

const { lambda } = lambdaUtils.createLambdaFunction({
  name: "washmeapp-api-users",
  resourceName: "washmeapp-api-users",
  provider: provider,
  bucketKey: "users-api/code.zip",
  bucketId: "washmeapp-code",
  environment: {
    variables: {
      USER_POOL_CLIENT_ID: "",
    },
  },
});

const { userPool } = cognitoUtils.createUserPool({
  userPoolClientName: "washme-user-pool-client",
  userPoolName: "washme-user-pool",
  trigger: lambda,
});

assignLambdaCognitoPolicy(userPool.arn);

const api = apiGatewayUtils.createAPIGateway({
  name: "users-api",
  handler: lambda,
  provider,
  userPool: userPool,
});

export const invoke = api.executionArn;
