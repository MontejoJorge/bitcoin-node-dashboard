// API Response Types
export interface IMainStore {
   totalConnections: number;
   totalUploadTraffic: number;
   totalDownloadTraffic: number;
   txInMeempool: number;
}

export interface INodeStore {
   client: string;
   protocolVersion: number;
   port: number;
   services: string[];
   uptime: number;
}

export interface IBlockchainStore {
   chain: string;
   size: number;
   difficulty: number;
   hashRate: number;
   lastBlock: number;
   lastBlockTime: number;
}

export interface INetwork {
   available: boolean;
   address: string | undefined;
}

export interface INetworkInfo {
   uploadTarget: {
      target: number;
      targetReached: boolean;
   };
   networks: {
      ipv4: INetwork;
      ipv6: INetwork;
      tor: INetwork;
      i2p: INetwork;
   };
}

export interface IPeer {
   id: number;
   address: string;
   services: string[];
   bytessent: number;
   bytesrecv: number;
   totalbytes: number;
   conectionTime: number;
   version: number;
   subversion: string;
   connection_type: string;
   inbound: boolean;
}

// API Response types
export interface HomeApiResponse {
   main: IMainStore;
   node: INodeStore;
   blockchain: IBlockchainStore;
   networkInfo: INetworkInfo;
   peers: IPeer[];
}

export interface PeersApiResponse {
   allTimeUploadTraffic: number;
   allTimeDownloadTraffic: number;
   banned: number;
   peers: IPeer[];
}