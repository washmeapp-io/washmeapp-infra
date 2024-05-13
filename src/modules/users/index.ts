import * as lambdaUtils from "../../lambdas";
import { Provider } from "@pulumi/aws";
import * as cognitoUtils from "../../cognito";
import { createUsersAPIGateway } from "../../api-gateway";
import * as dbUtils from "../../database";
import * as secretManagerUtils from "../../secrets-manager";

export interface IUserModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  dynamoSecretName: string;
  region: string;
}

export default function (args: IUserModuleArgs) {
  const { env, provider, cognitoSecretName, dynamoSecretName, region } = args;

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
        REGION: region,
      },
    },
    timeout: 5,
  });

  const { userPool, userPoolClient } = cognitoUtils.createUserPool({
    userPoolClientName: `${env}-washme-user-pool-client`,
    userPoolName: `${env}-washme-user-pool`,
    trigger: lambda,
  });

  createUsersAPIGateway({
    name: `${env}-users-api`,
    handler: lambda,
    provider,
    env,
  });

  dbUtils.createOPTCodesDynamoDBTable({
    env: env,
    tableName: `${env}-otp-codes-table`,
  });

  secretManagerUtils.createCognitoSecrets({
    name: cognitoSecretName,
    resourceName: cognitoSecretName,
    userPoolId: userPool.id,
    userPoolClientId: userPoolClient.id,
    region: region,
  });

  secretManagerUtils.createDynamoSecrets({
    name: dynamoSecretName,
    resourceName: dynamoSecretName,
    region: region,
    tableName: `${env}-otp-codes-table`,
  });

  return { userPool };
}
