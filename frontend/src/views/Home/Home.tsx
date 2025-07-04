import {
   formatLargeNumber,
   formatBytes,
   formatSeconds,
   formatUnixToTimeAgo,
   capitalizeFirst,
   formatHashPerSecond,
   compactNumber
} from '@/utils/utils';

import {
   FaIdCard,
   FaArrowRightArrowLeft,
   FaNetworkWired,
   FaClock,
   FaBullhorn,
   FaLink,
   FaHardDrive,
   FaMicrochip,
   FaGears,
   FaCube,
   FaCircleNodes,
   FaCloudArrowDown,
   FaCloudArrowUp,
   FaDatabase
} from 'react-icons/fa6';

import StatsCard from '@/components/StatsCard';
import TopClientsChart from './TopClientsChart';
import Card from '@/components/UI/Card';
import { useQuery } from '@tanstack/react-query';
import { bitcoinApi } from '@/store/api/bitcoinApi';
import { useRefreshTimeStore } from '@/store/refreshTimeStore';
import Header from '@/components/Header';


const Home = () => {
   const refreshTimeStore = useRefreshTimeStore();

   const { data: homeData, isLoading } = useQuery({
      queryKey: ['bitcoin', 'home'],
      queryFn: bitcoinApi.home,
      refetchInterval: refreshTimeStore.refreshTime > 0 ? refreshTimeStore.refreshTime : false,
   });

   return (
      <>
         <Header
            loading={isLoading}
            data={[
               {
                  icon: <FaCircleNodes size={70} color="#36a3f7" />,
                  title: "Total Connections",
                  value: formatLargeNumber(homeData?.main.totalConnections ?? 0)
               },
               {
                  icon: <FaCloudArrowUp size={70} color="#f4516c" />,
                  title: "Upload Traffic",
                  value: formatBytes(homeData?.main.totalUploadTraffic ?? 0)
               },
               {
                  icon: <FaCloudArrowDown size={70} color="#34bfa3" />,
                  title: "Download Traffic",
                  value: formatBytes(homeData?.main.totalDownloadTraffic ?? 0)
               },
               {
                  icon: <FaDatabase size={70} color="#ffcb8c" />,
                  title: "TX in Mempool",
                  value: formatLargeNumber(homeData?.main.txInMeempool ?? 0)
               }
            ]}
         />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 m-3 mt-7">
            <StatsCard
               title="Node"
               loading={isLoading}
               statsList={[
                  {
                     icon: <FaIdCard />,
                     name: 'Client',
                     value: homeData?.node.client ?? ''
                  },
                  {
                     icon: <FaArrowRightArrowLeft />,
                     name: 'Protocol',
                     value: homeData?.node.protocolVersion ?? 0
                  },
                  {
                     icon: <FaNetworkWired />,
                     name: 'Port',
                     value: homeData?.node.port ?? 0
                  },
                  {
                     icon: <FaClock />,
                     name: 'Uptime',
                     value: formatSeconds(homeData?.node.uptime ?? 0)
                  },
                  {
                     icon: <FaBullhorn />,
                     name: 'Services',
                     value: homeData?.node.services ?? []
                  }
               ]}
            />
            <StatsCard
               title="Blockchain"
               loading={isLoading}
               statsList={[
                  {
                     icon: <FaLink />,
                     name: 'Chain',
                     value: capitalizeFirst(homeData?.blockchain.chain ?? '')
                  },
                  {
                     icon: <FaHardDrive />,
                     name: 'Size',
                     value: formatBytes(homeData?.blockchain.size ?? 0)
                  },
                  {
                     icon: <FaMicrochip />,
                     name: 'Difficulty',
                     value: compactNumber(homeData?.blockchain.difficulty ?? 0)
                  },
                  {
                     icon: <FaGears />,
                     name: 'Hashrate',
                     value: formatHashPerSecond(homeData?.blockchain.hashRate ?? 0)
                  },
                  {
                     icon: <FaCube />,
                     name: 'Last Block',
                     value: formatLargeNumber(homeData?.blockchain.lastBlock ?? 0)
                  },
                  {
                     icon: <FaClock />,
                     name: 'Last Block Time',
                     value: formatUnixToTimeAgo(homeData?.blockchain.lastBlockTime ?? 0)
                  }
               ]}
            />
            <StatsCard
               title="Network"
               loading={isLoading}
               statsList={[
                  {
                     icon: null,
                     name: 'IPv4',
                     value: homeData?.networkInfo.networks.ipv4.available ?? false
                  },
                  {
                     icon: null,
                     name: 'IPv6',
                     value: homeData?.networkInfo.networks.ipv6.available ?? false
                  },
                  {
                     icon: null,
                     name: 'Tor',
                     value: homeData?.networkInfo.networks.tor.available ?? false
                  },
                  {
                     icon: null,
                     name: 'Traffic Limit Set',
                     value: (homeData?.networkInfo.uploadTarget.target ?? 0) > 0
                  },
                  {
                     icon: null,
                     name: 'Traffic Limited',
                     value: homeData?.networkInfo.uploadTarget.targetReached ?? false
                  }
               ]}
            />
            <Card title="Top Peer Clients" className="col-span-1 md:col-span-2">
               <TopClientsChart peers={homeData?.peers ?? []} />
            </Card>
         </div>
      </>
   );
};

export default Home;
