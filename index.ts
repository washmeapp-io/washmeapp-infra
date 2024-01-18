import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";

const provider = utils.createDefaultProvider();
const userBucket = buckets.createBucket({
  name: "washmeapp-code",
  provider: provider,
});
lambda.createLambdaFunction({
  name: "washmeapp-api-users",
  bucketId: userBucket.id,
  provider: provider,
});
