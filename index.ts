import * as pulumi from "@pulumi/pulumi";
import * as lambdaUtils from "./src/lambdas";
import * as apiGatewayUtils from "./src/api-gateway";
import * as cognitoUtils from "./src/cognito";
import * as dbUtils from "./src/database";
import * as utils from "./src/utils";
import * as secretManagerUtils from "./src/secrets-manager";
import {Input} from "@pulumi/pulumi";
import {Region} from "@pulumi/aws";


const env = process.env.PULUMI_ENV;
const awsRegion = process.env.AWS_REGION;

const config = new pulumi.Config("aws");
const region = config.require("region") || awsRegion;

if (!env || !region) {
  console.error("PULUMI_ENV and pulumi region are required");
  process.exit(0)
}

const provider = utils.createProvider(region as Input<Region>, env);
const cognitoSecretName = `${env}-cognito-secrets-v1`;
const dynamoSecretName = `${env}-dynamo-secrets-v1`;


const { lambda } = lambdaUtils.createLambdaFunction({
  name: `${env}-washmeapp-api-users`,
  resourceName: `${env}-washmeapp-api-users`,
  provider: provider,
  bucketKey: "users-api/code.zip",
  bucketId: "washmeapp-code",
  environment: {
    variables: {
      COGNITO_SECRET_NAME: cognitoSecretName,
      DYNAMODB_SECRET_NAME: dynamoSecretName,
      REGION: region
    }
  }
});

const { userPool, userPoolClient } = cognitoUtils.createUserPool({
  userPoolClientName: `${env}-washme-user-pool-client`,
  userPoolName: `${env}-washme-user-pool`,
  trigger: lambda,
});

const api = apiGatewayUtils.createAPIGateway({
  name: `${env}-users-api`,
  handler: lambda,
  provider,
  userPool: userPool,
});

dbUtils.createOPTCodesDynamoDBTable({env: env, tableName: `${env}-otp-codes-table`})

secretManagerUtils.createCognitoSecrets(
  {
    name: cognitoSecretName,
    resourceName: cognitoSecretName,
    userPoolId: userPool.id,
    userPoolClientId: userPoolClient.id,
    region: region
  }
);

secretManagerUtils.createDynamoSecrets(
  {
    name: dynamoSecretName,
    resourceName: dynamoSecretName,
    region: region,
    tableName: `${env}-otp-codes-table`
  }
);


export const invoke = api.executionArn;
