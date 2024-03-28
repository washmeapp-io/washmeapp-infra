import * as aws from "@pulumi/aws";

interface ICreateDynamoDBTable {
  env: string
}

export function createOPTCodesDynamoDBTable(args: ICreateDynamoDBTable) {
  const {env} = args
  return new aws.dynamodb.Table(`${env}-dynamo-db-otp-codes`, {
    name: "OTPCodes",
    billingMode: "PAY_PER_REQUEST",
    hashKey: "email",
    attributes: [
      {
        name: "email",
        type: "S",
      },
      {
        name: "OTPCode",
        type: "S",
      }
    ],
    ttl: {
      attributeName: "TimeToExist",
      enabled: false,
    },
    tags: {
      Environment: env,
    },
  });
}


