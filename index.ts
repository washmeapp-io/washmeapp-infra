import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";

const provider = utils.createDefaultProvider();
const userBucket = buckets.createBucket({
  name: "lambda-users",
  provider: provider,
});
lambda.createLambdaFunction({
  name: "washmeapp-user",
  code: userBucket,
  provider: provider,
});
