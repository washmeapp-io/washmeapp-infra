import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";

const userBucket = buckets.createBucket({ name: "lambda-users" });
lambda.createLambdaFunction("washmeapp", userBucket);
