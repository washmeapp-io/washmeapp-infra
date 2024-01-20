import * as aws from "@pulumi/aws";

import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";

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
  lambda.createLambdaFunction({
    name: "washmeapp-api-users",
    bucket: userBucket,
    provider: provider,
    bucketKey: usersApiCode.key,
  });
});
