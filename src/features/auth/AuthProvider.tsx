import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "../../lib/supabase/client";
type AuthContextValue = { session:Session|null; user:User|null; loading:boolean; signOut:()=>Promise<void> };
const AuthContext = createContext<AuthContextValue|null>(null);
export function AuthProvider({children}:{children:ReactNode}) {
  const [session,setSession]=useState<Session|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let alive=true; let subscription:{unsubscribe:()=>void}|undefined;
    try {
      const supabase=getSupabaseClient();
      supabase.auth.getSession().then(({data,error})=>{if(!alive)return;if(error)console.error("Falha ao recuperar sessão.",error);setSession(data.session);setLoading(false);});
      const {data}=supabase.auth.onAuthStateChange((_event,next)=>{if(alive){setSession(next);setLoading(false);}});
      subscription=data.subscription;
    } catch {setLoading(false);}
    return ()=>{alive=false;subscription?.unsubscribe();};
  },[]);
  const value=useMemo<AuthContextValue>(()=>({session,user:session?.user??null,loading,signOut:async()=>{const {error}=await getSupabaseClient().auth.signOut();if(error)throw error;}}),[session,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth deve ser usado dentro de AuthProvider.");return value;}