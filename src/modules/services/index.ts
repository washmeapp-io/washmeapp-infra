import * as lambdaUtils from "../../lambdas";
import { createServicesAPIGateway } from "../../api-gateway";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";

export interface IServiceModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  dynamoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
}

export default function (args: IServiceModuleArgs) {
  const { region, env, provider, dynamoSecretName, userPool } = args;
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
}
