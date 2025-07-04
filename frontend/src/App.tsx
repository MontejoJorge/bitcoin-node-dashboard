import NavBar from '@/components/NavBar';
import { useNavigate, Outlet, createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Login from '@/views/Login';
import { useUserStore } from "@/store/userStore";
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 5000,
         refetchOnWindowFocus: false,
      },
   },
});

const AuthLayout: React.FC = () => {

   const userStore = useUserStore();
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      if (!userStore.isLogged) {
         return navigate("/login");
      }
   }, [userStore.isLogged, location.pathname]);

   return (
      <React.Fragment>
         {userStore.isLogged && (
            <React.Fragment>
               <NavBar />
               <Outlet />
               <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  limit={2}
                  hideProgressBar={true}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  draggable={false}
                  pauseOnHover
                  theme="colored"
                  transition={Bounce}
               />
            </React.Fragment>
         )}
      </React.Fragment>
   );
}

const router = createBrowserRouter([
   {
      path: "/login",
      element: <Login />
   },
   {
      element: <AuthLayout />,
      children: [
         {
            path: "/",
            async lazy() {
               const Home = await import("@/views/Home/Home");
               return { Component: Home.default };
            }
         },
         {
            path: "/peers",
            async lazy() {
               const Peers = await import("@/views/Peers/Peers");
               return { Component: Peers.default };
            }
         }
      ]
   }
]);

const App: React.FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <div className="bg-gray-100 min-h-full pb-5">
            <RouterProvider router={router} />
         </div>
      </QueryClientProvider>
   );
};

export default App;
