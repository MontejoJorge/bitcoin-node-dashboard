import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
   TooltipComponent,
   TooltipComponentOption,
   LegendComponent,
   LegendComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import { FaSquare } from 'react-icons/fa6';
import clsx from 'clsx';
import LoadingSpiner from '@/components/UI/LoadingSpiner';
import { IPeer } from '@/types';

type EChartsOption = echarts.ComposeOption<
   TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

echarts.use([
   TooltipComponent,
   LegendComponent,
   PieChart,
   CanvasRenderer,
   LabelLayout
]);


export default function TopClientsChart({ peers, loading = false }: { peers: IPeer[], loading?: boolean }) {

   const [chart, setChart] = useState<echarts.ECharts>();
   const chartRef = useRef<HTMLDivElement>(null);

   const emtpyClientMap = new Map<string, number>();
   for (let i = 1; i <= 10; i++) {
      emtpyClientMap.set('0', 0);
   }

   const [mostCommonClients, setMostCommonClients] = useState<Map<string, number>>(emtpyClientMap);

   const colors = [
      "#9e0142",
      "#d53e4f",
      "#f46d43",
      "#fdae61",
      "#fee08b",
      "#e6f598",
      "#abdda4",
      "#66c2a5",
      "#3288bd",
      "#5e4fa2"
   ];

   const options: EChartsOption = {
      replaceMerge: ['series'],
      tooltip: {
         trigger: 'item'
      },
      legend: {
         show: false
      },
      color: colors,
      radius: '100%',
      series: [
         {
            name: 'Peers',
            type: 'pie',
            radius: ['50%', '100%'],
            itemStyle: {
               borderRadius: 10,
               borderColor: '#fff',
               borderWidth: 2
            },
            label: {
               show: false
            },
            data: Array.from(mostCommonClients).map(([client, count]) => ({ value: count, name: client }))
         }
      ]
   };

   useEffect(() => {
      const chart = echarts.init(chartRef.current);
      chart.setOption({ ...options, resizeObserver });
      setChart(chart);
      if (resizeObserver) resizeObserver.observe(chartRef.current as HTMLElement);

      return () => {
         chart?.dispose();
      }
   }, []);

   useEffect(() => {
      chart?.setOption({ series: [{ data: Array.from(mostCommonClients).map(([client, count]) => ({ value: count, name: client })) }] });
   }, [mostCommonClients]);

   useEffect(() => {
      setMostCommonClients(getMostCommonClient(peers));
   }, [peers]);

   return (
      <div className='grid'>
         <div className='col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-2'>
            <div ref={chartRef} className={clsx(loading && 'animate-pulse')} style={{ height: '300px' }} />
            <ul className="pt-6 md:pt-0">
               {loading && loadingList()}
               {!loading && (
                  Array.from(mostCommonClients).map(([client, count], index) => {
                     const total = peers.length;
                     const percentage = ((count / total) * 100).toFixed(0);
                     return (
                        <li key={client} className={clsx("flex justify-between items-center h-[10%]", {
                           'bg-gray-200': index % 2 === 0
                        })}>
                           <span className="flex items-center ps-1">
                              <FaSquare style={{ color: colors[index] }} className="pe-1" />
                              {` ${index + 1}. ${client}`}
                           </span>
                           <span className="pe-1">
                              {percentage}%
                           </span>
                        </li>
                     )
                  })
               )}
            </ul>
         </div>
         {loading && <LoadingOverlay />}
      </div>
   );
}

const loadingList = () => {
   return (
      Array.from({ length: 10 }).map((_, index) => {
         return (
            <li key={index} className={clsx("flex justify-between items-center h-[10%]")}>
               <div className="animate-pulse flex w-full">
                  <div className="flex-1">
                     <div className="h-5 bg-slate-200 rounded" />
                  </div>
               </div>
            </li>
         )
      })
   );
}

const LoadingOverlay = () => {
   return (
      <div className=" bg-white bg-opacity-70 z-10 flex items-center justify-center col-start-1 row-start-1 border-dashed">
         <div className="p-2 px-4 rounded-md flex items-center text-white bg-indigo-500">
            <LoadingSpiner />
            Loading...
         </div>
      </div>
   );
}

const resizeObserver = new window.ResizeObserver((entries) => {
   entries.map(({ target }) => {
      const instance = echarts.getInstanceByDom(target as HTMLElement);
      if (instance) {
         instance.resize();
      }
   });
});

const getMostCommonClient = (peers: IPeer[]) => {
   const clients: Map<string, number> = new Map();

   peers.forEach(peer => {
      if (peer.subversion) {
         peer.subversion = peer.subversion.replaceAll(':', ' ').replaceAll('/', ' / ')
         clients.set(peer.subversion, (clients.get(peer.subversion) || 0) + 1);
      }
   });

   const sortedClients = Array.from(clients.entries()).sort((a, b) => b[1] - a[1]);
   const mostCommonClients = new Map(sortedClients.slice(0, 9));
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const other = sortedClients.slice(9).reduce((acc, [_client, count]) => acc + count, 0);
   mostCommonClients.set('Other', other);
   return mostCommonClients;
}