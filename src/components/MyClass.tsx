// frontend/src/components/MyClass.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, LogOut, Monitor, Users } from "lucide-react";
import { useAuth } from "../context/AuthContex";

type Role = "student" | "teacher";

interface Peer {
  id: string;
  username: string;
  role: Role;
  stream?: MediaStream;
  micOn: boolean;
  videoOn: boolean;
  screenOn?: boolean;
  pc: RTCPeerConnection;
  videoSender?: RTCRtpSender;
  audioSender?: RTCRtpSender;
}

interface UserInfo {
  socketId: string;
  userName: string;
  role: Role;
}

const SIGNALING_SERVER_URL = "http://localhost:5000";
const STUN_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

const MyClass: React.FC = () => {
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const spotlightRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);

  const roomId = "room1";

  /* ---------- Helpers ---------- */
  const attachStream = (el: HTMLVideoElement | null, stream: MediaStream | undefined, muted = false) => {
    if (!el || !stream) return;
    el.srcObject = stream;
    el.muted = muted;
    el.autoplay = true;
    el.playsInline = true;
    el.play().catch(console.error);
  };

  const updateSpotlight = () => {
    const screenPeer = peers.find(p => p.screenOn && p.stream);
    const teacherPeer = peers.find(p => p.role === "teacher" && p.stream);
    const firstPeer = peers.find(p => p.stream);
    const stream = screenPeer?.stream || teacherPeer?.stream || firstPeer?.stream || localStream.current || null;
    attachStream(spotlightRef.current, stream ?? undefined, stream === localStream.current);
  };

  /* ---------- Peer Connection ---------- */
  const createPeer = async (peerId: string, role: Role, username: string) => {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
    const remoteStream = new MediaStream();

    pc.ontrack = ev => {
      const stream = ev.streams[0] || remoteStream;
      const screenOn = ev.track.label.toLowerCase().includes("screen");
      setPeers(prev => {
        const exists = prev.find(p => p.id === peerId);
        if (exists) return prev.map(p => p.id === peerId ? { ...p, stream, screenOn: p.screenOn || screenOn } : p);
        return [...prev, { id: peerId, username, role, stream, micOn: true, videoOn: true, screenOn, pc }];
      });
      updateSpotlight();
    };

    pc.onicecandidate = ev => {
      if (ev.candidate) socketRef.current?.emit("ice-candidate", { target: peerId, candidate: ev.candidate });
    };

    pc.onconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        setPeers(prev => prev.filter(p => p.id !== peerId));
        updateSpotlight();
        pc.close();
      }
    };

    localStream.current?.getTracks().forEach(track => pc.addTrack(track, localStream.current!));

    return pc;
  };

  const callUser = async (userInfo: UserInfo) => {
    if (!socketRef.current || userInfo.socketId === socketRef.current.id) return;
    if (peers.find(p => p.id === userInfo.socketId)) return;

    const pc = await createPeer(userInfo.socketId, userInfo.role, userInfo.userName);
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("offer", { target: userInfo.socketId, offer, senderInfo: { socketId: socketRef.current.id, userName: user?.username || "Guest", role: user?.role || "student" } });
    setPeers(prev => [...prev, { id: userInfo.socketId, username: userInfo.userName, role: userInfo.role, pc, micOn: true, videoOn: true }]);
  };

  /* ---------- Join Room ---------- */
  const joinRoom = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      attachStream(localVideoRef.current, localStream.current, true);

      socketRef.current = io(SIGNALING_SERVER_URL, { transports: ["websocket"] });
      socketRef.current.on("connect", () => {
        socketRef.current?.emit("join-classroom", {
          roomCode: roomId,
          userName: user?.username || "Guest",
          role: user?.role || "student",
        });
      });

      socketRef.current.on("all-users", (users: UserInfo[]) => users.forEach(callUser));
      socketRef.current.on("user-joined", callUser);

      socketRef.current.on("offer", async ({ offer, sender, senderInfo }) => {
        const pc = await createPeer(sender, senderInfo.role, senderInfo.userName);
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("answer", { target: sender, answer });
      });

      socketRef.current.on("answer", async ({ answer, sender }) => {
        const peer = peers.find(p => p.id === sender);
        if (peer) await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socketRef.current.on("ice-candidate", ({ candidate, sender }) => {
        const peer = peers.find(p => p.id === sender);
        if (peer && candidate) peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      });

      socketRef.current.on("user-left", ({ socketId }) => {
        setPeers(prev => prev.filter(p => p.id !== socketId));
        updateSpotlight();
      });

      setIsTeacher(user?.role === "teacher");
      setJoined(true);
    } catch (err) {
      console.error(err);
      alert("Unable to access camera/microphone or connect to server.");
    }
  };

  /* ---------- Controls ---------- */
  const toggleMic = () => {
    if (!localStream.current) return;
    const status = !micOn;
    localStream.current.getAudioTracks().forEach(t => t.enabled = status);
    setMicOn(status);
  };

  const toggleVideo = () => {
    if (!localStream.current) return;
    const status = !videoOn;
    localStream.current.getVideoTracks().forEach(t => t.enabled = status);
    setVideoOn(status);
    updateSpotlight();
  };

  const startScreenShare = async () => {
    if (sharingScreen || !navigator.mediaDevices.getDisplayMedia) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      peers.forEach(p => p.pc.getSenders().find(s => s.track?.kind === "video")?.replaceTrack(screenTrack).catch(console.error));
      setSharingScreen(true);
      updateSpotlight();

      screenTrack.onended = () => {
        setSharingScreen(false);
        const localTrack = localStream.current?.getVideoTracks()[0];
        peers.forEach(p => localTrack && p.pc.getSenders().find(s => s.track?.kind === "video")?.replaceTrack(localTrack).catch(console.error));
        updateSpotlight();
      };
    } catch (err) {
      console.error(err);
    }
  };

  const endSession = () => {
    socketRef.current?.disconnect();
    localStream.current?.getTracks().forEach(t => t.stop());
    setPeers([]);
    setJoined(false);
  };

  /* ---------- Effects ---------- */
  useEffect(() => {
    attachStream(localVideoRef.current, localStream.current, true);
  }, [localStream.current]);

  useEffect(() => {
    peers.forEach(p => attachStream(document.getElementById(`peer-${p.id}`) as HTMLVideoElement, p.stream));
    updateSpotlight();
  }, [peers]);

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen flex flex-col bg-[#101623] text-white">
      <header className="flex justify-between items-center px-6 py-3 bg-[#1b2130] shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Video className="w-6 h-6 text-sky-400" /> Okapi Virtual Class</h1>
        <span className="text-sky-300 flex items-center gap-1 font-medium"><Users className="w-4 h-4" /> {user?.username || "Guest"}</span>
      </header>

      {!joined ? (
        <main className="flex flex-1 items-center justify-center">
          <div className="bg-[#1b2130] p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Join your virtual class</h2>
            <button onClick={joinRoom} className="w-full bg-sky-500 hover:bg-sky-600 py-3 rounded-lg font-semibold transition">Join Room</button>
          </div>
        </main>
      ) : (
        <main className="flex flex-1 relative gap-3 p-4">
          <section className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-5xl h-[70vh] bg-black rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex-1 p-4 flex items-center justify-center">
                <div className="w-full h-full border-4 border-dashed border-gray-700 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <video ref={spotlightRef} autoPlay playsInline className="w-full h-full object-contain bg-black" />
                </div>
              </div>
            </div>
          </section>

          <aside className="w-[300px] flex flex-col gap-2 p-2 overflow-y-auto bg-[#121826] rounded-lg">
            <div className="p-2 font-semibold bg-[#1b2130] rounded">{`Participants (${peers.length + 1})`}</div>
            {isTeacher && (
              <div className="flex items-center gap-2 p-2 bg-[#0f1724] rounded text-sm">
                <Users className="w-5 h-5" />
                <div><div className="font-medium">{user?.username}</div><div className="text-xs text-gray-400">Teacher (you)</div></div>
              </div>
            )}
            {peers.map(p => (
              <div key={p.id} className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-700 bg-black">
                {p.videoOn && p.stream ? <video id={`peer-${p.id}`} autoPlay playsInline className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 font-bold">Video Off</div>}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs py-1 text-center flex justify-between px-2 items-center">
                  <span className="flex items-center gap-2">{p.screenOn ? <span className="px-1 py-0.5 text-xs bg-yellow-600 rounded">SHARING</span> : null}<span>{p.username}</span></span>
                  <span className="text-xs text-gray-300 flex items-center gap-2"><span>{p.role}</span><span>{p.micOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-red-500" />}</span></span>
                </div>
              </div>
            ))}
          </aside>
        </main>
      )}

      {joined && (
        <footer className="flex items-center justify-center gap-4 bg-[#1b2130] py-3 shadow-inner">
          <button onClick={toggleMic} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition">
            {micOn ? <Mic className="w-5 h-5 text-green-400" /> : <MicOff className="w-5 h-5 text-red-500" />}
          </button>
          <button onClick={toggleVideo} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition">
            {videoOn ? <Video className="w-5 h-5 text-blue-400" /> : <VideoOff className="w-5 h-5 text-red-500" />}
          </button>
          <button onClick={startScreenShare} className={`bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition ${sharingScreen ? "ring-2 ring-yellow-500" : ""}`}>
            <Monitor className="w-5 h-5 text-yellow-400" />
          </button>
          <button onClick={endSession} className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition">
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </footer>
      )}
    </div>
  );
};

export default MyClass;
