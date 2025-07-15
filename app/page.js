"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Page(){
  const router = useRouter();
  const [name, setName] = useState("");
  const [author, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMsg] = useState("");
  const [loading, setLoad] = useState(false);

  const searchName = ()=>{
     localStorage.setItem("name", name);
      router.push("/messages");
  }

  const handleSubmit = async(e)=>{
    setLoad(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/newmsg", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({author, to, message})
      })
      const data = await res.json();
      if(data.success){
        setLoad(false);
        Swal.fire({
          icon: "success",
          title: data.message
        })
      }
      else{
        setLoad(false);
        Swal.fire({
          icon: "error",
          title: data.message
        })
      }
    } catch (error) {
      setLoad(false);
      Swal.fire({
        icon: "error",
        title: error.message
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-red-100 flex flex-col items-center justify-center px-4 py-12 gap-16">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-rose-700 mb-4">
          💌 Find the Love Letters Written Just for You
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Search your name and discover all the heartfelt messages waiting for
          you. Someone might be thinking of you.
        </p>
        <div className="text-red-600 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter your name..."
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={searchName}
            className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            💖 Search
          </button>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-semibold text-rose-600 mb-4">
          ✍️ Write a Message for Someone
        </h2>
        <p className="text-gray-700 mb-6">
          Got a message for someone special? Let your heart speak — leave them a
          note that they’ll never forget.
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white text-red-600 shadow-md rounded-lg p-6 w-full max-w-xl space-y-4"
        >
          <input
            type="text"
            placeholder="From"
            value={author}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full px-4 py-2 h-28 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300"
          ></textarea>
          <button
            type="submit"
            className={loading ? "pointer-events-none bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-md w-full" : "bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-md w-full pointer-events-auto"}
          >
            {loading ? "😏 sending..." : "💌 Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}