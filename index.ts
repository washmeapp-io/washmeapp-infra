import * as aws from "@pulumi/aws";

import * as lambdaUtils from "./src/lambdas";
import * as apiGatewayUtils from "./src/api-gateway";
import * as cognitoUtils from "./src/cognito";
import * as utils from "./src/utils";
import * as secretManagerUtils from "./src/secrets-manager";
import { lambdaRole } from "./src/roles/roles";

const provider = utils.createDefaultProvider();

const { lambda } = lambdaUtils.createLambdaFunction({
  name: "washmeapp-api-users",
  resourceName: "washmeapp-api-users",
  provider: provider,
  bucketKey: "users-api/code.zip",
  bucketId: "washmeapp-code",
});

const { userPool, userPoolClient } = cognitoUtils.createUserPool({
  userPoolClientName: "washme-user-pool-client",
  userPoolName: "washme-user-pool",
  trigger: lambda,
});

const api = apiGatewayUtils.createAPIGateway({
  name: "users-api",
  handler: lambda,
  provider,
  userPool: userPool,
});

const { cognitoSecret } = secretManagerUtils.createCognitoSecrets(
  userPool.id,
  userPoolClient.id
);

export const invoke = api.executionArn;
