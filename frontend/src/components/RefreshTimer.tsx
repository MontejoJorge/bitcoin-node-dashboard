import Select, { components, ControlProps, Props as SelectProps } from 'react-select';
import { useRefreshTimeStore } from "@/store/refreshTimeStore";
import { FaRotate } from 'react-icons/fa6';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function Control({ children, ...props }: ControlProps) {
   const [rotate, setRotate] = useState(false);

   // @ts-expect-error onRefreshMouseDown
   const { onRefreshMouseDown } = props.selectProps;

   function handleMouseDown(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
      onRefreshMouseDown(e);
      setRotate(true);
      setTimeout(() => setRotate(false), 1000);
   }

   return (
      <components.Control {...props}>
         <span onMouseDown={handleMouseDown} className="mx-2">
            <FaRotate height={20} color="9ca3af" className={rotate ? "animate-spin" : ""} />
         </span>
         {children}
      </components.Control>
   );
}

export default function RefreshTime(props: SelectProps) {
   const refreshTimeStore = useRefreshTimeStore();
   const queryClient = useQueryClient();

   function onRefreshClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
      e.preventDefault();
      e.stopPropagation();
      // Manually trigger refresh of bitcoin queries
      queryClient.invalidateQueries({ queryKey: ['bitcoin'] });
   }

   const optionsMap = new Map([
      [15000, '15s'],
      [30000, '30s'],
      [60000, '1m'],
      [0, 'Off']
   ]);

   return (
      <Select
         {...props}
         className="outline-none"
         isSearchable={false}
         // @ts-expect-error onRefreshMouseDown
         onRefreshMouseDown={onRefreshClick}
         onChange={(e) => refreshTimeStore.setRefreshTime((e as { value: number }).value)}
         components={{ Control: Control }}
         options={Array.from(optionsMap).map(([value, label]) => ({ value, label }))}
         defaultValue={{ value: refreshTimeStore.refreshTime, label: optionsMap.get(refreshTimeStore.refreshTime)}}
         styles={{
            control: (baseStyles) => ({
               ...baseStyles,
               backgroundColor: '#1f2937',
            }),
         }}
         theme={(theme) => ({
            ...theme,
            colors: {
               ...theme.colors,
               //after select dropdown option
               primary50: "#9ca3af",
               //Border and Background dropdown color
               primary: "#9ca3af",
               //Background hover dropdown color
               primary25: "#9ca3af",
               //Background color
               //neutral0: "#1f2937",
               //Border before select
               neutral20: "#9ca3af",
               //Hover border
               neutral30: "#9ca3af",
               //No options color
               neutral40: "#9ca3af",
               //Select color
               neutral50: "#9ca3af",
               //arrow icon when click select
               neutral60: "#9ca3af",
               //Text color
               neutral80: "#9ca3af",
               //Text color when hover
               neutral90: "#9ca3af",
            }
         })}
      />
   );
}