import Card from "@/components/UI/Card";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaArrowRightLong, FaArrowLeftLong, FaArrowDown, FaArrowUp, FaBan, FaCircleNodes, FaCloudArrowDown, FaCloudArrowUp } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { usePeerStore } from "@/store/peerStore";
import { formatBytes, formatLargeNumber, formatUnixTime } from "@/utils/utils";
import { useEffect, useState } from "react";
import clsx from "clsx";
import React from "react";
import useRefreshData from "@/hooks/useRefreshData";
import Header from "@/components/Header";

type TableField = {
   name: string;
   key: string;
   show: 'always' | 'md' | 'lg' | 'xl' | '2xl';
};

function Peers() {
   const [sortField, setSortField] = useState("");
   const [order, setOrder] = useState("");
   const [showDetails, setShowDetails] = useState<number | null>(null);

   const peerStore = usePeerStore();

   useRefreshData([peerStore]);

   const tableFields: TableField[] = [{
      name: 'Id',
      key: 'id',
      show: 'always'
   }, {
      name: 'Address',
      key: 'address',
      show: 'md'
   }, {
      name: 'Direction',
      key: 'inbound',
      show: 'always'
   }, {
      name: 'Services',
      key: 'services',
      show: 'md'
   }, {
      name: 'Age',
      key: 'conectionTime',
      show: 'always'
   }, {
      name: 'Client',
      key: 'subversion',
      show: 'md'
   }, {
      name: 'Total Traffic',
      key: 'totalbytes',
      show: 'always'
   }];

   //To get the show property on showOrHideValue function
   const tableFieldsHashMap = new Map(tableFields.map((field) => [field.key, field]));

   useEffect(() => {
      peerStore.sortPeers(sortField, order);
   }, [peerStore.peers, sortField, order]);


   function formatServices(services: string[]): React.ReactNode {
      if (services.length === 0) {
         services = ['None'];
      }
      return services.map((service, index) => {
         let tooltip = '';
         if (service === 'NETWORK') {
            service = 'N';
            tooltip = 'Network';
         } else if (service === 'BLOOM') {
            service = 'B';
            tooltip = 'Bloom';
         } else if (service === 'WITNESS') {
            service = 'W';
            tooltip = 'Witness';
         } else if (service === 'COMPACT_FILTERS') {
            service = 'CF';
            tooltip = 'Compact Filters';
         } else if (service === 'NETWORK_LIMITED') {
            service = 'NL';
            tooltip = 'Network Limited';
         } else if (service.match(/^UNKNOWN/)) {
            tooltip = service;
            service = 'U';
         }

         return (
            <React.Fragment key={index}>
               <span
                  className="group relative m-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer whitespace-nowrap"
               >
                  {service}
                  {
                     tooltip && (
                        <span
                           className="pointer-events-none absolute -top-10 -left-2/4 w-max opacity-0 transition-opacity group-hover:opacity-100 rounded-md p-2 bg-gray-900 text-white"
                        >
                           {tooltip}
                        </span>
                     )
                  }
               </span>
            </React.Fragment>
         );
      });
   }

   function showOrHideValue(fieldName: TableField['key']) {
      const showProperty = tableFieldsHashMap.get(fieldName)?.show;
      return clsx({
         'hidden': showProperty === 'md',
         'md:table-cell': showProperty === 'md',
         'lg:table-cell': showProperty === 'lg',
         'xl:table-cell': showProperty === 'xl',
         '2xl:table-cell': showProperty === '2xl',
      });
   }

   function handleRowClick(peerId: number) {
      if (showDetails === peerId) {
         setShowDetails(null);
      } else {
         setShowDetails(peerId);
      }
   }

   return (
      <>
         <Header
            loading={peerStore.loading}
            data={[
               {
                  icon: <FaCircleNodes size={70} color="#36a3f7" />,
                  title: "Total Connections",
                  value: formatLargeNumber(peerStore.peers.length)
               },
               {
                  icon: <FaCloudArrowUp size={70} color="#f4516c" />,
                  title: "All Time Upload Traffic",
                  value: formatBytes(peerStore.allTimeUploadTraffic)
               },
               {
                  icon: <FaCloudArrowDown size={70} color="#34bfa3" />,
                  title: "All Time Download Traffic",
                  value: formatBytes(peerStore.allTimeDownloadTraffic)
               },
               {
                  icon: <FaBan size={70} color="#ffcb8c" />,
                  title: "Banned Peers",
                  value: formatLargeNumber(peerStore.banned)
               }
            ]}
         />
         <Card className="m-3 mt-7" title="Connected Peers">
            <div className="border rounded-lg overflow-hidden text-sm md:text-base">
               <table className="table-auto w-full">
                  <thead className="bg-gray-200 rounded-2xl border-b">
                     <tr>
                        {tableFields.map((field) => (
                           <th
                              key={field.key}
                              className={clsx('p-2.5 cursor-pointer', {
                                 'hidden': field.show === 'md',
                                 'md:table-cell': field.show === 'md',
                                 'lg:table-cell': field.show === 'lg',
                                 'xl:table-cell': field.show === 'xl',
                                 '2xl:table-cell': field.show === '2xl',
                              })}
                              onClick={() => {
                                 if (sortField === field.key) {
                                    setOrder(order === 'asc' ? 'desc' : 'asc');
                                 } else {
                                    setSortField(field.key);
                                    setOrder('asc');
                                 }
                              }}
                           >
                              <div className="flex justify-center items-center">
                                 {field.name}
                                 <span className="ml-1 flex flex-col text-gray-400">
                                    <TiArrowSortedUp className={clsx({ "text-black": (sortField === field.key && order != 'asc') })} />
                                    <TiArrowSortedDown className={clsx({ "text-black": (sortField === field.key && order == 'asc') })} />
                                 </span>
                              </div>
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {peerStore.peers.map((peer) => (
                        <React.Fragment key={peer.id}>
                           <tr
                              onClick={() => handleRowClick(peer.id)}
                              className="border-b last:border-0 hover:bg-gray-100 text-center odd:bg-gray-50 cursor-pointer"
                           >
                              <td className={clsx(showOrHideValue('id'))}>
                                 {peer.id}
                              </td>
                              <td className={showOrHideValue('address')}>
                                 {peer.address.split(':')[0]}
                              </td>
                              <td className={showOrHideValue('direction')}>
                                 <span className="flex items-center justify-center">
                                    {peer.inbound
                                       ? <FaArrowRightLong className="text-green-500" title="Inbound" />
                                       : <FaArrowLeftLong className="text-red-500" title="Outbound" />}
                                 </span>
                              </td>
                              <td className={clsx(showOrHideValue('services'))}>
                                 <div className="flex flex-wrap justify-center items-center py-2.5">
                                    {formatServices(peer.services)}
                                 </div>
                              </td>
                              <td className={showOrHideValue('conectionTime')}>
                                 {formatUnixTime(peer.conectionTime)}
                              </td>
                              <td className={showOrHideValue('subversion')}>
                                 <span className="border-b border-dashed" title={peer.subversion}>
                                    {peer.subversion.split('/')[0].replace(':', ' ')}
                                 </span>
                              </td>
                              <td className={showOrHideValue('totalbytes')}>
                                 {formatBytes(peer.bytessent + peer.bytesrecv)}
                              </td>
                           </tr>
                           {showDetails === peer.id && (
                              <tr>
                                 <td colSpan={tableFields.length} className="p-1">
                                    <div className="flex flex-col sm:flex-row justify-items-center sm:justify-around p-1 py-3 bg-blue-50 border border-dashed border-blue-200 rounded ">
                                       <div className="flex justify-center sm:justify-between items-center">
                                          <TbWorld className="mr-1" />
                                          <span className="font-medium me-1">Full address:</span>
                                          {peer.address}
                                       </div>
                                       <div className="flex justify-center sm:justify-between items-center">
                                          <FaArrowUp className="mr-1" />
                                          <span className="font-medium me-1">Upload:</span>
                                          {formatBytes(peer.bytessent)}
                                       </div>
                                       <div className="flex justify-center sm:justify-between items-center">
                                          <FaArrowDown className="mr-1" />
                                          <span className="font-medium me-1">Download:</span>
                                          {formatBytes(peer.bytesrecv)}
                                       </div>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </>
   );
}

export default Peers;
