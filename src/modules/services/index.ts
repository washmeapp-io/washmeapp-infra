import * as lambdaUtils from "../../lambdas";
import { createServicesAPIGateway } from "../../api-gateway";
import * as database from "../../database";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";

export interface IServiceModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  dynamoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
  mongoAtlasOrgId: string;
}

export default function (args: IServiceModuleArgs) {
  const { region, env, provider, dynamoSecretName, userPool, mongoAtlasOrgId } =
    args;
  const { lambda } = lambdaUtils.createLambdaFunction({
    name: `${env}-washmeapp-api-services`,
    resourceName: `${env}-washmeapp-api-services`,
    provider: provider,
    bucketKey: "services-api/code.zip",
    bucketId: "washmeapp-code",
    environment: {
      variables: {
        DYNAMODB_SECRET_NAME: dynamoSecretName,
        REGION: region,
      },
    },
    timeout: 5,
  });

  createServicesAPIGateway({
    name: `${env}-services-api`,
    handler: lambda,
    provider: provider,
    userPool: userPool,
    env: env,
  });

  database.servicesApiDB.createMongoAtlasCluster({
    mongoAtlasOrgId,
    env,
    region,
  });
}
