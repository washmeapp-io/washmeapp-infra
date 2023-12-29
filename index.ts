import * as buckets from "./src/buckets";
import * as lambda from "./src/lambdas";

lambda.createLambdaFunction("washmeapp", buckets.lambdaCode);
