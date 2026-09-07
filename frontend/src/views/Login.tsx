import React, { useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Logo from '@/icons/btc.svg';
import { useUserStore } from "@/store/userStore";

export default function Login() {
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [rememberMe, setRememberMe] = useState(true);
   const [error, setError] = useState('');

   const passwordRef = useRef<HTMLInputElement>(null);
   const userStore = useUserStore();
   const navigate = useNavigate();

   useEffect(() => {
      if (userStore.jwt) {
         navigate('/');
      }
   },[]);

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!password) {
         if (passwordRef.current) {
            passwordRef.current.focus();
         }
         return setError('Password is required');
      }

      setShowPassword(false);

      await userStore.login(password, rememberMe)
         .then(() => {
            return navigate('/');
         })
         .catch((e) => {
            setError(e.message);
            if (passwordRef.current) {
               passwordRef.current.focus();
            }
         });
   };

   return (
      <div className="flex flex-row min-h-screen justify-center items-center">
         <div className="flex justify-between flex-col bg-white p-6 rounded-lg">
            <div className="flex flex-shrink-0 items-center">
               <img className="h-10 w-auto me-1" src={Logo} style={{ transform: 'rotate(13.88deg)' }} />
               <div className="text-2xl font-bold">
                  Bitcoin Node Dasboard
               </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center">
               <fieldset disabled={userStore.loading}>
                  <div className="relative mt-7">
                     <label
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                        onClick={() => setShowPassword(!showPassword)}
                     >
                        {showPassword ? <FaEyeSlash color="#9ca3af" /> : <FaEye color="#9ca3af" />}
                     </label>
                     <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        className="border border-gray-400 rounded p-2 ps-3 w-full"
                     />
                  </div>
                  {error && <div className="text-red-500 mt-2 font-medium">{error}</div>}
                  <div className="mt-2">
                     <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                     />
                     <label htmlFor="rememberMe" className="ps-1">
                        Remember me
                     </label>
                  </div>
                  <button
                     type="submit"
                     className="bg-blue-500 text-white p-2 rounded mt-2 w-full disabled:opacity-75"
                  >
                     Login
                  </button>
               </fieldset>
            </form>
         </div>
      </div>
   );
}