import * as aws from "@pulumi/aws";

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

  const api = apiGateway.createAPIGateway({
    name: "users-api",
    handler: usersLambda,
    provider,
  });

  api.deployment.apply(() => {});
});
