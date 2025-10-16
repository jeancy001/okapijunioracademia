import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Users, Video, VideoOff, LogOut } from "lucide-react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContex";

const socket = io("https://okapibackend.onrender.com");

interface Peer {
  id: string;
  username: string;
  role: string; // "Teacher" | "Student" | "Parler"
  stream?: MediaStream;
  micOn: boolean;
  videoOn: boolean;
}

const MyClass: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState("room1");
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});
  const localStream = useRef<MediaStream | null>(null);
  const { user } = useAuth();

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // ------------------- JOIN ROOM -------------------
  const joinRoom = async () => {
    try {
      setJoined(true);
      setError(null);

      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

      socket.emit("join-classroom", {
        roomCode: roomId,
        userName: user?.username || "Anonymous",
        userId: user?.id || "unknown",
        role: user?.role || "Student",
      });
    } catch (err) {
      console.error("Error joining room:", err);
      setError("⚠️ Please allow camera and microphone access to join the class.");
    }
  };

  // ------------------- TOGGLE AUDIO/VIDEO -------------------
  const toggleMic = () => {
    if (!localStream.current) return;
    const newStatus = !micOn;
    localStream.current.getAudioTracks().forEach((track) => (track.enabled = newStatus));
    setMicOn(newStatus);
    socket.emit("toggle-media", { roomCode: roomId, userId: user?.id, mediaType: "audio", status: newStatus });
  };

  const toggleVideo = () => {
    if (!localStream.current) return;
    const newStatus = !videoOn;
    localStream.current.getVideoTracks().forEach((track) => (track.enabled = newStatus));
    setVideoOn(newStatus);
    socket.emit("toggle-media", { roomCode: roomId, userId: user?.id, mediaType: "video", status: newStatus });
  };

  // ------------------- END SESSION -------------------
  const endSession = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    setPeers([]);
    socket.emit("leave-room", { roomCode: roomId, userId: user?.id });
    setJoined(false);
  };

  // ------------------- SOCKET HANDLERS -------------------
  useEffect(() => {
    if (!joined) return;

    const createPeerConnection = async (peer: { socketId: string; username: string; role: string }, isInitiator: boolean) => {
      if (!localStream.current) return;
      const pc = new RTCPeerConnection(servers);
      peerConnections.current[peer.socketId] = pc;

      localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current!));

      pc.ontrack = (event) => {
        setPeers((prev) => [
          ...prev.filter((p) => p.id !== peer.socketId),
          { id: peer.socketId, username: peer.username, role: peer.role, stream: event.streams[0], micOn: true, videoOn: true },
        ]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit("ice-candidate", { target: peer.socketId, candidate: event.candidate });
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { target: peer.socketId, offer });
      }
    };

    socket.on("all-users", (users: { socketId: string; username: string; role: string }[]) => {
      users.forEach((u) => createPeerConnection(u, true));
    });

    socket.on("user-joined", (peer: { socketId: string; username: string; role: string }) => {
      createPeerConnection(peer, false);
    });

    socket.on("offer", async ({ offer, sender, username, role }) => {
      await createPeerConnection({ socketId: sender, username, role }, false);
      const pc = peerConnections.current[sender];
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: sender, answer });
    });

    socket.on("answer", async ({ answer, sender }) => {
      const pc = peerConnections.current[sender];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate, sender }) => {
      const pc = peerConnections.current[sender];
      if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("user-left", ({ socketId }) => {
      const pc = peerConnections.current[socketId];
      if (pc) pc.close();
      delete peerConnections.current[socketId];
      setPeers((prev) => prev.filter((p) => p.id !== socketId));
    });

    socket.on("toggle-media", ({ userId, mediaType, status }) => {
      setPeers((prev) =>
        prev.map((p) =>
          p.id === userId
            ? { ...p, videoOn: mediaType === "video" ? status : p.videoOn, micOn: mediaType === "audio" ? status : p.micOn }
            : p
        )
      );
    });

    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("toggle-media");
    };
  }, [joined]);

  // ------------------- UI -------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <header className="flex justify-between items-center px-8 py-5 bg-blue-700 text-white shadow-md">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <Video className="w-6 h-6" /> My Virtual Class
        </h1>
        <span className="italic font-semibold flex items-center gap-1">
          <Users className="w-4 h-4" /> Okapi Junior Academia
        </span>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 p-8">
        {!joined ? (
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <Video className="text-blue-600 w-10 h-10 mb-3" />
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Users /> Join a Class
            </h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={joinRoom}
              className="bg-blue-600 text-white w-full py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <Video /> Join Room
            </button>
          </div>
        ) : (
          <div className="bg-white w-full max-w-7xl p-6 rounded-2xl shadow-xl">
            {/* Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <Users className="w-5 h-5" /> Participants: {peers.length + 1}
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={toggleMic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                    micOn ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  {micOn ? "Mic On" : "Mic Off"}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                    videoOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {videoOn ? "Video On" : "Video Off"}
                </button>

                <button
                  onClick={endSession}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition duration-300"
                >
                  <LogOut className="w-4 h-4" /> End Class
                </button>
              </div>
            </div>

{/* Video Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Local Video */}
  <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      className={`w-full h-64 object-cover transition-opacity duration-500 ${
        videoOn ? "opacity-100" : "opacity-0"
      }`}
    />
    {!videoOn && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white text-4xl transition-opacity duration-500">
        <VideoOff />
      </div>
    )}
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-center py-1 text-sm font-medium">
      {user?.username || "You"} - {user?.role || "Student"}
    </div>
  </div>

  {/* Remote Videos */}
  {peers.map(({ id, username, role, stream, videoOn, micOn }) => (
    <div key={id} className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
      <video
        autoPlay
        playsInline
        ref={(ref) => { if (ref && stream) ref.srcObject = stream; }}
        className={`w-full h-64 object-cover transition-opacity duration-500 ${
          videoOn ? "opacity-100" : "opacity-0"
        }`}
      />
      {!videoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white text-4xl transition-opacity duration-500">
          <VideoOff />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-center py-1 text-sm font-medium flex justify-between px-2">
        <span>👤 {username} {micOn ? <Mic className="inline w-4 h-4" /> : <MicOff className="inline w-4 h-4" />}</span>
        <span>{role}</span>
      </div>
    </div>
  ))}
</div>

          </div>
        )}
      </main>
    </div>
  );
};

export default MyClass;
