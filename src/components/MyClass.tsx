import React, { useRef, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Mic, MicOff, Users, Video, VideoOff, LogOut, PenTool, Monitor, VolumeX } from "lucide-react";
import { useAuth } from "../context/AuthContex";

interface Peer {
  id: string;
  username: string;
  role: string;
  stream?: MediaStream;
  micOn: boolean;
  videoOn: boolean;
}

interface UserInfo {
  socketId: string;
  userName: string;
  userId: string;
  role: "student" | "teacher";
}

const MyClass: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ peerId: string; connection: RTCPeerConnection; stream: MediaStream }[]>([]);

  const { user } = useAuth();

  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [teacher, setTeacher] = useState(false);

  const [teacherStream, setTeacherStream] = useState<MediaStream | null>(null);
  const [teacherScreen, setTeacherScreen] = useState<MediaStream | null>(null);
  const [boardData, setBoardData] = useState<string>("");

  const roomId = "room1";

  useEffect(() => {
    if (user?.role === "teacher") setTeacher(true);
  }, [user]);

  // --- JOIN ROOM ---
  const joinRoom = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

      socketRef.current = io("https://okapibackend.onrender.com");

      socketRef.current.emit("join-classroom", {
        roomCode: roomId,
        userName: user?.username || "Guest",
        userId: user?.id || "guest",
        role: user?.role || "student",
        videoOn: true,
        micOn: true,
      });

      socketRef.current.on("all-users", (users: UserInfo[]) => {
        users.forEach((u) => callUser(u));
      });

      socketRef.current.on("offer", async ({ offer, sender, role }) => {
        const connection = createPeerConnection(sender, role);
        await connection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        socketRef.current?.emit("answer", { target: sender, answer });
      });

      socketRef.current.on("answer", async ({ answer, sender }) => {
        const peer = peersRef.current.find((p) => p.peerId === sender);
        if (peer) await peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socketRef.current.on("ice-candidate", ({ candidate, sender }) => {
        const peer = peersRef.current.find((p) => p.peerId === sender);
        if (peer && candidate) peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socketRef.current.on("user-joined", (userInfo: UserInfo) => callUser(userInfo));

      socketRef.current.on("user-left", ({ socketId }) => {
        setPeers((prev) => prev.filter((p) => p.id !== socketId));
        peersRef.current = peersRef.current.filter((p) => p.peerId !== socketId);
        if (socketId === "teacher") {
          setTeacherStream(null);
          setTeacherScreen(null);
        }
      });

      socketRef.current.on("mute-student", ({ targetId }) => {
        if (targetId === user?.id && localStream.current) {
          localStream.current.getAudioTracks().forEach((t) => (t.enabled = false));
          setMicOn(false);
        }
      });

      socketRef.current.on("update-video-status", ({ targetId, video }) => {
        setPeers((prev) => prev.map((p) => (p.id === targetId ? { ...p, videoOn: video } : p)));
      });

      socketRef.current.on("board-update", (data: string) => setBoardData(data));

      setJoined(true);
    } catch (err) {
      console.error("Join error:", err);
      alert("Unable to access camera/microphone.");
    }
  };

  // --- CREATE PEER CONNECTION ---
  const createPeerConnection = (peerId: string, role: string) => {
    const connection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    localStream.current?.getTracks().forEach((track) => connection.addTrack(track, localStream.current!));

    const remoteStream = new MediaStream();

    connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((remoteTrack) => {
        remoteStream.addTrack(remoteTrack);

        if (role === "teacher") {
          const isScreen = remoteTrack.label.toLowerCase().includes("screen");
          if (isScreen) setTeacherScreen(remoteStream);
          else setTeacherStream(remoteStream);
        } else {
          setPeers((prev) => {
            const existing = prev.find((p) => p.id === peerId);
            if (!existing) return [...prev, { id: peerId, username: "Student", role: "student", stream: remoteStream, micOn: true, videoOn: true }];
            return prev.map((p) => (p.id === peerId ? { ...p, stream: remoteStream } : p));
          });
        }
      });
    };

    connection.onicecandidate = (event) => {
      if (event.candidate) socketRef.current?.emit("ice-candidate", { target: peerId, candidate: event.candidate });
    };

    peersRef.current.push({ peerId, connection, stream: remoteStream });
    return connection;
  };

  const callUser = async (userInfo: UserInfo) => {
    const connection = createPeerConnection(userInfo.socketId, userInfo.role);
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    socketRef.current?.emit("offer", { target: userInfo.socketId, offer });
  };

  // --- REAL-TIME VIDEO & SCREEN UPDATE ---
  useEffect(() => {
    if (localVideoRef.current && localStream.current) localVideoRef.current.srcObject = localStream.current;
  }, [localStream.current]);

  useEffect(() => {
    peers.forEach((p) => {
      const videoEl = document.getElementById(`peer-${p.id}`) as HTMLVideoElement;
      if (videoEl && p.stream) videoEl.srcObject = p.stream;
    });
  }, [peers]);

  useEffect(() => {
    const teacherVideoEl = document.getElementById("teacher-video") as HTMLVideoElement;
    if (teacherVideoEl) teacherVideoEl.srcObject = teacherScreen || teacherStream;
  }, [teacherStream, teacherScreen]);

  // --- CONTROLS ---
  const toggleMic = () => {
    if (!localStream.current) return;
    const status = !micOn;
    localStream.current.getAudioTracks().forEach((t) => (t.enabled = status));
    setMicOn(status);
  };

  const toggleVideo = () => {
    if (!localStream.current) return;
    const status = !videoOn;
    localStream.current.getVideoTracks().forEach((t) => (t.enabled = status));
    setVideoOn(status);
    socketRef.current?.emit("update-video-status", { targetId: user?.id, video: status });
  };

  const muteAll = () => {
    peersRef.current.forEach((peer) => socketRef.current?.emit("mute-student", { targetId: peer.peerId }));
  };

  const toggleScreenShare = async () => {
    try {
      if (!sharingScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        const oldVideoTrack = localStream.current?.getVideoTracks()[0];
        if (oldVideoTrack) {
          oldVideoTrack.stop();
          localStream.current?.removeTrack(oldVideoTrack);
        }

        localStream.current?.addTrack(screenTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

        peersRef.current.forEach(({ connection }) => {
          const sender = connection.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });

        screenTrack.onended = () => toggleScreenShare();
      } else {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const camTrack = camStream.getVideoTracks()[0];

        const oldTrack = localStream.current?.getVideoTracks()[0];
        if (oldTrack) {
          oldTrack.stop();
          localStream.current?.removeTrack(oldTrack);
        }

        localStream.current?.addTrack(camTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

        peersRef.current.forEach(({ connection }) => {
          const sender = connection.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(camTrack);
        });
      }
      setSharingScreen(!sharingScreen);
    } catch (err) {
      console.error("Screen share error:", err);
      alert("Unable to share screen.");
    }
  };

  const endSession = () => {
    localStream.current?.getTracks().forEach((t) => t.stop());
    setPeers([]);
    peersRef.current = [];
    setJoined(false);
    setSharingScreen(false);
    setTeacherStream(null);
    setTeacherScreen(null);
    setBoardData("");
  };

  // --- WHITEBOARD ---
  const startDraw = () => setDrawing(true);
  const stopDraw = () => {
    setDrawing(false);
    canvasRef.current?.getContext("2d")?.beginPath();
    if (canvasRef.current && socketRef.current) {
      const data = canvasRef.current.toDataURL();
      socketRef.current.emit("board-update", data);
    }
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !drawing) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101623] text-white">
      <header className="flex justify-between items-center px-6 py-3 bg-[#1b2130] shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-sky-400" /> Okapi Virtual Class
        </h1>
        <span className="text-sky-300 flex items-center gap-1 font-medium">
          <Users className="w-4 h-4" /> {user?.username || "Guest"}
        </span>
      </header>

      {!joined ? (
        <main className="flex flex-1 items-center justify-center">
          <div className="bg-[#1b2130] p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Join your virtual class</h2>
            <button onClick={joinRoom} className="w-full bg-sky-500 hover:bg-sky-600 py-3 rounded-lg font-semibold transition">
              Join Room
            </button>
          </div>
        </main>
      ) : (
        <main className="flex flex-1 relative">
          {/* TEACHER / SHARED SCREEN */}
          <section className="flex-1 flex flex-col bg-black p-2 rounded-lg relative">
            {(teacherScreen || teacherStream) ? (
              <video autoPlay playsInline id="teacher-video" className="w-full h-full object-cover rounded-lg"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">Waiting for teacher...</div>
            )}

            {/* STUDENT VIDEO IN CORNER */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-32 h-24 absolute bottom-4 right-4 rounded-lg border border-gray-600 object-cover"
            />

            {boardData && (
              <img src={boardData} alt="Shared board" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"/>
            )}
          </section>

          {/* STUDENT SIDEBAR */}
          <aside className="w-[250px] flex flex-col gap-2 p-2 overflow-y-auto bg-[#121826] rounded-lg ml-2">
            {peers.map(({ id, username, stream, videoOn }) => (
              <div key={id} className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 bg-black">
                {videoOn && stream ? (
                  <video id={`peer-${id}`} autoPlay playsInline className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 font-bold">Video Off</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs py-1 text-center flex justify-between px-2 items-center">
                  <span>{username}</span>
                </div>
              </div>
            ))}
          </aside>

          {/* WHITEBOARD */}
          {showBoard && (
            <section className="w-[350px] hidden lg:flex flex-col border-l border-gray-700 bg-[#121826] relative ml-2">
              <h3 className="p-3 font-semibold bg-[#1b2130] border-b border-gray-700 text-sky-400">Virtual Board ✏️</h3>
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={draw}
                width={350}
                height={350}
                className="bg-white rounded-xl m-2 cursor-crosshair"
              />
            </section>
          )}
        </main>
      )}

      {/* CONTROLS */}
      {joined && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-[#1b2130] px-4 py-3 rounded-full shadow-xl border border-gray-700">
          <button onClick={toggleMic} className={`p-3 rounded-full ${micOn ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
            {micOn ? <Mic /> : <MicOff />}
          </button>
          <button onClick={toggleVideo} className={`p-3 rounded-full ${videoOn ? "bg-sky-500 hover:bg-sky-600" : "bg-gray-600 hover:bg-gray-700"}`}>
            {videoOn ? <Video /> : <VideoOff />}
          </button>
          {teacher && <>
            <button onClick={() => setShowBoard((prev) => !prev)} className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-600"><PenTool/></button>
            <button onClick={toggleScreenShare} className={`p-3 rounded-full ${sharingScreen ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"}`}><Monitor/></button>
            <button onClick={muteAll} className="p-3 rounded-full bg-red-500 hover:bg-red-600"><VolumeX/></button>
          </>}
          <button onClick={endSession} className="p-3 rounded-full bg-red-700 hover:bg-red-800"><LogOut/></button>
        </div>
      )}
    </div>
  );
};

export default MyClass;
