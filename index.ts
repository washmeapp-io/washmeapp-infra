import * as pulumi from "@pulumi/pulumi";
import * as utils from "./src/utils";
import { Input } from "@pulumi/pulumi";
import { Region } from "@pulumi/aws";
import * as infra from "./src/modules";

const env = process.env.PULUMI_ENV;
const awsRegion = process.env.AWS_REGION;

const config = new pulumi.Config("aws");
const region = config.require("region") || awsRegion;

if (!env || !region) {
  console.error("PULUMI_ENV and pulumi region are required");
  process.exit(0);
}

const provider = utils.createProvider(region as Input<Region>, env);
const cognitoSecretName = `${env}-cognito-secrets-v2`;
const dynamoSecretName = `${env}-dynamo-secrets-v2`;

const { userPool } = infra.runUserModuleInfrastructure({
  env,
  provider,
  cognitoSecretName,
  dynamoSecretName,
  region,
});

infra.runServicesModuleInfrastructure({
  env,
  cognitoSecretName,
  dynamoSecretName,
  region,
  userPool,
  provider,
});
