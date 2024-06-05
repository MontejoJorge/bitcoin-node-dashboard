import { useMainStore } from "@/store/mainStore";
import { formatLargeNumber, formatBytes } from "@/utils/utils";
import { useEffect } from "react";
import { FaCircleNodes, FaCloudArrowUp, FaCloudArrowDown, FaDatabase } from "react-icons/fa6";

export default function Header() {

   const mainStore = useMainStore();

   useEffect(() => {
      mainStore.fetch();
   }, []);

   const data = [
      {
         icon: <FaCircleNodes size={70} color="#36a3f7" />,
         title: "Total Connections",
         value: formatLargeNumber(mainStore.totalConnections)
      },
      {
         icon: <FaCloudArrowUp size={70} color="#f4516c" />,
         title: "Upload Traffic",
         value: formatBytes(mainStore.totalUploadTraffic)
      },
      {
         icon: <FaCloudArrowDown size={70} color="#34bfa3" />,
         title: "Download Traffic",
         value: formatBytes(mainStore.totalDownloadTraffic)
      },
      {
         icon: <FaDatabase size={70} color="#ffcb8c" />,
         title: "TX in Mempool",
         value: formatLargeNumber(mainStore.txInMeempool)
      }
   ];

   return (
      <header>
         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 m-3">
            {
               data.map((stat, i) => {
                  return (
                     <div key={i} className="flex items-center justify-between bg-white rounded-md p-5">
                        <div>
                           { stat.icon }
                        </div>
                        <div className="flex flex-col justify-between h-full text-right">
                           <div className="font-bold text-lg text-gray-400">
                              { stat.title }
                           </div>
                           <div className="font-bold text-2xl text-gray-600">
                              { stat.value }
                           </div>
                        </div>
                     </div>
                  );
               })
            }
         </div>
      </header>
   );
}