import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";

const provider = utils.createDefaultProvider();
const userBucket = buckets.createBucket({
  name: "washmeapp-code",
  provider: provider,
});
userBucket.onObjectCreated("users-api", () => {
  lambda.createLambdaFunction({
    name: "washmeapp-api-users",
    bucket: userBucket,
    provider: provider,
    bucketKey: "users-api",
  });
});
