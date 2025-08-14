@@ .. @@
         <div className="flex items-center space-x-4">
           <button className="p-2 text-secondary-400 hover:text-white transition-colors">
             <Search className="w-5 h-5" />
           </button>
           
           {user && (
             <div className="flex items-center space-x-2 text-sm">
               <User className="w-5 h-5 text-primary-400" />
               <span className="text-white font-medium">
-                {user.user_metadata?.first_name || user.email?.split('@')[0]}
+                {user.firstName || user.email?.split('@')[0]}
               </span>
             </div>
           )}