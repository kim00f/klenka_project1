'use client';
import supabase from '../../lib/createclient';
import { useState ,useEffect} from 'react';


export default function SignIn() {
  const [session, setSession] = useState(null);
  
   useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  
  /* const handleLogin = async () => {
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      
    });
   
  }; */

   const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  if(!session){
  return (
    <a
      href='/login'
      className="bg-neutral text-white .rounded-lg pr-1 pl-1 "
    >
      Sign In
    </a>
  );
}
else{
  return(
    <div>
      
        <button onClick={signOut} className="bg-neutral text-white .rounded-lg pr-1 pl-1 " >Sign out</button>
        
  </div>)
}
}