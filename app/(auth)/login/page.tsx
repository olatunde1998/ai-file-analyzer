export default async function Login() {
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>
          <div>
            {/* {isLoading ? ( */}
            {/* <button className="rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-white animate-pulse">
               <p>Signing you in...</p>
             </button>
           ) : ( */}
            <>
              {/* {auth.isAuthenticated ? ( */}
              {/* <button className="rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-white" onClick={auth.signOut}>
                   <p>Log Out</p>
                 </button> */}
              {/* ) : ( */}
              <button
                style={{
                  background: "linear-gradient(to bottom, #8e98ff, #606beb)",
                  boxShadow: "0px 74px 21px 0px #6678ef00",
                }}
                className="rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-white"
              >
                <p>Log In</p>
              </button>
              {/* )} */}
            </>
            {/* )} */}
          </div>
        </section>
      </div>
    </main>
  );
}
