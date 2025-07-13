import { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { io } from 'socket.io-client';

const USER_ID = "user1";

const AdminChat = () => {
  const socket = useMemo(() => io("http://192.168.1.15:3003"), []);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("register", "admin");
    });
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, { id: Date.now(), ...message }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const sendMsg = async () => {
    if (msg.trim() || file) {
      let fileData = null;
      if (file) {
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            data: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      socket.emit("sendMessage", {
        senderId: "admin",
        receiverId: USER_ID,
        message: msg.trim(),
        file: fileData,
      });
      setMsg("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const playAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const openMic = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new window.MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setIsRecording(false);
        const audioData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        socket.emit("sendMessage", {
          senderId: "admin",
          receiverId: USER_ID,
          message: "Voice Message",
          audio: audioData,
        });
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (error) {
      setIsRecording(false);
      alert("Microphone access error.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh", bgcolor: "#f9f9f9" }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee", bgcolor: "#fff", display: "flex", alignItems: "center", minHeight: 64 }}>
        {isMobile && (
          <IconButton sx={{ mr: 1, visibility: "hidden" }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar sx={{ mr: 2 }} />
        <Typography variant="h6">Chat</Typography>
      </Box>
      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 1, sm: 2 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: 0,
          bgcolor: "#f9f9f9",
          scrollbarWidth: "none", // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: message.user === "admin" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: { xs: "90%", sm: "70%" },
                background: message.user === "admin" ? "#1976d2" : "#f5f5f5",
                color: message.user === "admin" ? "white" : "black",
                padding: { xs: 1, sm: 2 },
                borderRadius: 2,
                wordWrap: "break-word",
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              {/* Show image if file is image */}
              {message.file && message.file.type && message.file.type.startsWith("image/") && (
                <Box sx={{ mb: 1 }}>
                  <img
                    src={URL.createObjectURL(message.file)}
                    alt={message.file.name}
                    style={{ maxWidth: "100%", height: "auto", borderRadius: 8, display: "block" }}
                  />
                </Box>
              )}
              {/* Show file name if not image */}
              {message.file && (!message.file.type || !message.file.type.startsWith("image/")) && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: "12px", opacity: 0.8 }}>
                    📎 {message.file.name}
                  </Typography>
                </Box>
              )}
              {message.audio && (
                <Box sx={{ mb: 1 }}>
                  <IconButton
                    onClick={() => playAudio(message.audio)}
                    sx={{
                      background: message.user === "admin" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                      color: message.user === "admin" ? "white" : "black",
                    }}
                  >
                    ▶️
                  </IconButton>
                </Box>
              )}
              <Typography variant="body1">{message.message}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "10px" }}>
                {message.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      {/* Input field */}
      <Box sx={{ width: "100%", position: "sticky", bottom: 0, zIndex: 2, background: "#fff", py: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box sx={{ width: { xs: "98%", sm: "80%", md: "60%", lg: "40%" } }}>
            <Paper
              elevation={3}
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMsg();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                p: { xs: 0.5, sm: 1 },
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
                width: "100%",
              }}
            >
              <IconButton onClick={handleFileButtonClick}>
                <AttachFileIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <InputBase
                inputRef={inputRef}
                sx={{
                  ml: 1,
                  flex: 1,
                  bgcolor: "#fff",
                  borderRadius: 20,
                  px: 2,
                  py: 1,
                  fontSize: { xs: 14, sm: 16 },
                }}
                placeholder="Type a message"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              {msg.trim() || file ? (
                <IconButton color="primary" type="submit">
                  <SendIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={openMic}
                  sx={{
                    color: isRecording ? "red" : "inherit",
                    animation: isRecording ? "pulse 1s infinite" : "none",
                  }}
                >
                  <MicIcon />
                </IconButton>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminChat;

