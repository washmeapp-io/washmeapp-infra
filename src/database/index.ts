import * as aws from "@pulumi/aws";

interface ICreateDynamoDBTable {
  env: string;
  tableName: string;
}

export function createOPTCodesDynamoDBTable(args: ICreateDynamoDBTable) {
  const {env, tableName} = args
  return new aws.dynamodb.Table(`${env}-dynamo-db-otp-codes`, {
    name: tableName,
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
    globalSecondaryIndexes: [{
      name: "OTPCodeIndex",
      hashKey: "OTPCode",
      projectionType: "ALL",
    }],
    ttl: {
      attributeName: "TimeToExist",
      enabled: false,
    },
    tags: {
      Environment: env,
    },
  });
}


