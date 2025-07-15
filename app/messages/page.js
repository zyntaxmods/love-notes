"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page(){
      const router = useRouter();
      const [data, setData] = useState([]);
      const fetchUser = async()=>{ 
        const name = localStorage.getItem("name");
        const nameArray = {
          name: name
        }
        try {
        const res = await fetch(`/api/getuser`,{
          method: "POST",
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(nameArray)
        })
        const data = await res.json();
       
        if(data.success){
          setData(data.data);
          if(data.data.length === 0){
            Swal.fire({
              icon: "info",
              title:"No messages found"
            })
          }
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: `${data.message}`
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message
        })
      }
      }
      useEffect(() =>{
        fetchUser();
      }, [])
    

  return (
    <div className="p-3 w-[100vw] h-[100vh] bg-gradient-to-br from-pink-400 via-rose-300 to-red-400">
      <div className="flex flex-wrap justify-start items-start gap-2">
        {data.map((user, index) => (
          <div
            key={index}
            className="max-w-lg mx-auto bg-gradient-to-br from-pink-100 via-rose-200 to-red-100 shadow-xl rounded-2xl p-6 border border-pink-300 animate-fade-in"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-rose-700">
                💌 Love Letter
              </h2>
              <p className="text-xs text-rose-500">
                {new Date(user.date).toLocaleString("en-US", {
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <div className="text-sm mb-4 space-y-1">
              <p>
                <span className="text-rose-700 font-bold text-base">
                  💌 From:
                </span>
                <span className="ml-2 text-gray-900 font-medium">
                  {user.author}
                </span>
              </p>
              <p>
                <span className="text-rose-700 font-bold text-base">
                  🎯 To:
                </span>
                <span className="ml-2 text-gray-900 font-medium">
                  {user.to}
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl text-gray-700 shadow-inner">
              <p className="whitespace-pre-line">{user.message}</p>
            </div>
          </div>
        ))}
      </div>

      <button id="back" onClick={() => router.push("/")}
        className="fixed top-0 left-0 m-2 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
      >
        Back
      </button>
    </div>
  );
}