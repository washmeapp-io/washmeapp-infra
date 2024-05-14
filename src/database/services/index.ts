import * as mongodbatlas from "@pulumi/mongodbatlas";

interface ICreateMongoAtlasClusterArgs {
  env: string;
  mongoAtlasOrgId: string;
  region: string;
}

export function createMongoAtlasCluster(args: ICreateMongoAtlasClusterArgs) {
  // TODO: Fix this, is not working, getting this error:  POST: HTTP 401 Unauthorized (Error code: "") Detail: You are not authorized for this resource. Reason: Unauthorized. Params: []
  // const { env, mongoAtlasOrgId, region } = args;
  // const projectName = `${env}-washme-app-project`;
  // const project = new mongodbatlas.Project(projectName, {
  //   name: projectName,
  //   orgId: mongoAtlasOrgId,
  // });
  //
  // const clusterName = `${env}-washme-app-cluster`;
  // return new mongodbatlas.Cluster(clusterName, {
  //   projectId: project.id,
  //   name: clusterName,
  //   providerName: "AWS",
  //   providerRegionName: region,
  //   providerInstanceSizeName: "M10",
  // });
}
