import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";

export function createCognitoSecrets(
  userPoolId: Output<string>,
  userPoolClientId: Output<string>
) {
  // Combine the two Outputs into a single structure and then convert into a JSON string
  const cognitoDetails = pulumi
    .all([userPoolId, userPoolClientId])
    .apply(([poolId, clientId]) => {
      return JSON.stringify({
        userPoolId: poolId,
        userPoolClientId: clientId,
      });
    });

  const cognitoSecret = new aws.secretsmanager.Secret("cognitoSecret", {
    name: "cognitoDetails",
    description: "Stores Cognito user pool and client IDs",
  });

  new aws.secretsmanager.SecretVersion("cognitoSecretVersion", {
    secretId: cognitoSecret.id,
    secretString: cognitoDetails,
  });

  return { cognitoSecret };
}
