import * as aws from "@pulumi/aws";
import * as crypto from "crypto";

import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";
import * as apiGateway from "./src/api-gateway";

(async () => {
  const provider = utils.createDefaultProvider();
  const usersApiBucket = await aws.s3.getBucket({
    bucket: "washmeapp-code",
  });
  const usersApiBucketObject = await aws.s3.getBucketObject({
    bucket: usersApiBucket.bucket,
    key: "users-api",
  });
  const usersLambda = lambda.createLambdaFunction({
    name: "washmeapp-api-users",
    bucketId: usersApiBucket.id,
    provider: provider,
    bucketKey: usersApiBucketObject.key,
  });

  const usersApi = apiGateway.createAPIGateway({
    name: "users-api",
    handler: usersLambda,
    provider,
  });

  const usersApiDeployment = new aws.apigateway.Deployment(
    "users-api-deployment",
    {
      restApi: usersApi.api.id,
      triggers: {
        redeployment: usersApi.api.body
          .apply((body) => JSON.stringify(body))
          .apply((toJSON) =>
            crypto.createHash("sha1").update(toJSON).digest("hex")
          ),
      },
    }
  );
  new aws.apigateway.Stage("users-api-stage", {
    deployment: usersApiDeployment.id,
    restApi: usersApi.api.id,
    stageName: "dev",
  });
})();
