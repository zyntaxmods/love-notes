"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page(){
  const router = useRouter();
  const [name, setName] = useState("");
  const [author, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMsg] = useState("");
  const [loading, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [delayedSearch, setDelayedSearch] = useState('');
  const [results, setResults] = useState([]);
  const [track, setTrack] = useState(""); 
  let [isSet, setSet] = useState(false);
  const [songUrl, setUrl] = useState("");

  const getSpotifyToken = async () => {
  const clientId = "f84ef00677e54c97a2e18866a09ec9be";
  const clientSecret = "fbbae5d4dd034cada7ba05e8164bbe49";

  const cachedToken = localStorage.getItem("spotify_token");
  const cachedTime = localStorage.getItem("spotify_token_time");

  const oneHour = 3600 * 1000;
  const now = Date.now();

  if (cachedToken && cachedTime && now - cachedTime < oneHour) {
    return cachedToken;
  }

  const encoded = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem("spotify_token", data.access_token);
    localStorage.setItem("spotify_token_time", now.toString());
    return data.access_token;
  } else {
    throw new Error("Failed to get Spotify token");
  }
};


  useEffect(() =>{
      const handler = setTimeout(() => {
        setDelayedSearch(search);
      }, 500);
      return () => clearTimeout(handler);
  }, [search])

  useEffect(() => {
    if (delayedSearch) {
      getMusic(delayedSearch);
    }
  }, [delayedSearch]);

  const convertMusic = async(song) =>{
    const res = await fetch(`https://open.spotify.com/oembed?url=${song}`);
    const data = await res.json();
    if(data){
      setUrl(data.iframe_url);
    }
  }

  const getMusic = async (song) =>{
    const accessToken = await getSpotifyToken(); 
    if(!accessToken){
      Swal.fire({
        icon: "error",
        title: "Spotify access token is not set",
        text: "Please set the ACCESS_TOKEN environment variable."
      });
      return;
    }
    const url = `https://api.spotify.com/v1/search?q=${song}&type=track&limit=5`;
    const res = await fetch(url, {
      headers:{
          Authorization:`Bearer ${accessToken}`,
          "Content-Type": "application/json"
      }
    })
    const data = await res.json();
    if(data){
      setResults(data.tracks.items);
    }
  }

  const searchName = ()=>{
    if(!name){
      Swal.fire({
        icon: "warning",
        title: "Please enter your name",
        timer: 2000,
        showConfirmButton: false
      })
    }
    else{
     localStorage.setItem("name", name);
      router.push("/messages");
    }
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
        body: JSON.stringify({author, to, message, songUrl})
      })
      const data = await res.json();
      if(data.success){
        setLoad(false);
        Swal.fire({
          icon: "success",
          title: data.message
        })
        setName("");
        setFrom("");
        setTo("");
        setMsg("");
        setUrl("");
        setSet(false);
        setSearch("");
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
          <input
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
            type="text"
            placeholder="Type a song"
            value={isSet ? track : search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {results.length > 0 && (
  <div className="mt-2 border border-rose-300 rounded-md bg-white max-h-48 overflow-y-auto shadow-lg">
    {results.map((track) => (
      <div
        key={track.id}
        className="px-4 py-2 hover:bg-rose-100 cursor-pointer text-left"
        onClick={() => {
          setSet(true);
          setTrack(`${track.name} - ${track.artists[0].name}`);
          convertMusic(`${track.external_urls.spotify}`);
          setResults([]); 
        }}
      >
        <div className="font-medium text-gray-700">{track.name}</div>
        <div className="text-sm text-gray-500">{track.artists[0].name}</div>
      </div>
    ))}
  </div>
)}

          <p className="text-sm text-gray-500">
            Note: Messages are public and can be viewed by anyone.
          </p>
          <button
            type="submit"
            className={
              loading
                ? "pointer-events-none bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-md w-full"
                : "bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-md w-full pointer-events-auto"
            }
          >
            {loading ? "😏 sending..." : "💌 Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}