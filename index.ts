import * as pulumi from "@pulumi/pulumi";
import * as utils from "./src/utils";
import { Input } from "@pulumi/pulumi";
import { Region } from "@pulumi/aws";
import * as infra from "./src/modules";

const env = process.env.PULUMI_ENV;
const awsRegion = process.env.AWS_REGION;
const orgId = process.env.MONGO_ATLAS_ORG_IG;

const awsConfig = new pulumi.Config("aws");
const atlasConfig = new pulumi.Config("atlas");
const region = awsConfig.require("region") || awsRegion;
const mongoAtlasOrgId = atlasConfig.require("orgId") || orgId;

if (!env || !region || !mongoAtlasOrgId) {
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
  mongoAtlasOrgId,
});
