import * as aws from "@pulumi/aws";
import * as crypto from "crypto";

import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";
import * as apiGateway from "./src/api-gateway";

const provider = utils.createDefaultProvider();
const userBucket = buckets.createBucket({
  name: "washmeapp-code",
  provider: provider,
});
userBucket.onObjectCreated("users-api", async () => {
  const usersApiCode = await aws.s3.getBucketObject({
    bucket: "washmeapp-code",
    key: "users-api",
  });
  const usersLambda = lambda.createLambdaFunction({
    name: "washmeapp-api-users",
    bucket: userBucket,
    provider: provider,
    bucketKey: usersApiCode.key,
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
});
