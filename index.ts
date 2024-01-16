import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";
import * as utils from "./src/utils";

const provider = utils.createDefaultProvider();
const userBucket = buckets.createBucket({
  name: "lambda-users-code",
  provider: provider,
});
const lambdaCode = buckets.uploadLambdaCode({
  bucket: userBucket,
  filePath: "./",
});
lambda.createLambdaFunction({
  name: "washmeapp-user",
  code: lambdaCode,
  provider: provider,
});
