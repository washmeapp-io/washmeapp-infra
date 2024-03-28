import * as aws from "@pulumi/aws";
import {Input} from "@pulumi/pulumi";
import {Region} from "@pulumi/aws";

export function createProvider(region: Input<Region>, env: string) {
  return new aws.Provider(`${env}-${region}-provider`, {
    region: region,
  });
}
