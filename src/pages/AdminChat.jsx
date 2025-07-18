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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { BASE_URL } from "../costants";
import { io } from "socket.io-client";

const AdminChat = () => {
  const socket = useMemo(() => io(`${BASE_URL}`), []);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [adminId, setAdminId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(() => {
    const stored = localStorage.getItem("selectedUserId");
    return stored ? parseInt(stored) : null;
  });
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    if (selectedUserId !== null && selectedUserId !== undefined) {
      localStorage.setItem("selectedUserId", selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    const storedAdminId = parseInt(localStorage.getItem("id"));
    if (!storedAdminId) return;
    setAdminId(storedAdminId);

    const fetchUserList = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(`${BASE_URL}/api/web/chat/userList`);
        const data = await res.json();
        setUserList(data.message || []);
      } catch (err) {
        console.error("User list fetch error:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    if (!adminId || !selectedUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/web/chat/adminChat?userId=${selectedUserId}`
        );
        const json = await res.json();

        if (json?.message) {
          const formattedMessages = json.message.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            message: msg.message,
            file: msg.file,
            audio: msg.audio,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchMessages();

    socket.emit("register", adminId);

    const handleNewMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
        },
      ]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      // Don't disconnect socket here, as it would break user switching
    };
  }, [selectedUserId, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const sendMsg = async () => {
    if (!adminId || (!msg.trim() && !file)) return;

    let fileData = null;
    if (file) {
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            name: file.name,
            type: file.type,
            data: reader.result,
          });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const payload = {
      senderId: adminId,
      receiverId: selectedUserId,
      senderType: "admin",
      message: msg.trim() || "📎 File Sent",
      file: fileData,
    };

    socket.emit("sendMessage", payload);

    setMsg("");
    setFile(null);
    fileInputRef.current.value = "";
    inputRef.current?.focus();
  };

  const openMic = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        socket.emit("sendMessage", {
          senderId: adminId,
          receiverId: selectedUserId,
          senderType: "admin",
          message: "🎤 Voice Message",
          audio: base64,
        });

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (err) {
      console.error("Mic error:", err);
      setIsRecording(false);
    }
  };

  const playAudio = (base64) => {
    const audio = new Audio(base64);
    audio.play();
  };

  const showSidebar = !isMobile || (isMobile && showUserList);
  const showChat = !isMobile || (isMobile && !showUserList);

  return (
    <Box sx={{ display: "flex", height: "80vh", bgcolor: "#f9f9f9" }}>
      {showSidebar && (
        <Box
          sx={{
            width: { xs: '100%', md: 280 },
            borderRight: { xs: 'none', md: '1px solid #eee' },
            bgcolor: "#fff",
            maxHeight: userList.length > 6 ? '420px' : 'none',
            overflowY: userList.length > 6 ? 'auto' : 'visible',
            display: { xs: selectedUserId && !showUserList ? "none" : "block", md: "block" },
          }}
        >
          <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #eee" }}>
            Users
          </Typography>
          {loadingUsers ? (
            <Typography sx={{ p: 2 }}>Loading...</Typography>
          ) : (
            userList.map((user, idx) => (
              <Box
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id);
                  if (isMobile) setShowUserList(false);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  minHeight: 56,
                  cursor: "pointer",
                  bgcolor: selectedUserId === user.id ? "#e3f2fd" : "inherit",
                  borderBottom: idx === userList.length - 1 ? 'none' : '1px solid #f5f5f5',
                  "&:hover": { bgcolor: "#f1f1f1" },
                }}
              >
                <Avatar src={user.image || undefined} sx={{ mr: 2 }}>
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.mobile}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
      {showChat && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #eee",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isMobile && (
              <IconButton sx={{ mr: 1 }} onClick={() => setShowUserList(true)}>
                <ArrowBackIcon />
              </IconButton>
            )}
            {selectedUserId && (
              <>
                <Avatar sx={{ mr: 2, ml: 2 }}>
                  {userList.find((u) => u.id === selectedUserId)?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6">
                  {userList.find((u) => u.id === selectedUserId)?.name || "Admin Chat"}
                </Typography>
              </>
            )}
            {!selectedUserId && (
              <Typography variant="h6" sx={{ ml: 2 }}>Select a user to chat</Typography>
            )}
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              px: 2,
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              '&::-webkit-scrollbar': {
                display: 'none', 
              },
            }}
          >
            {selectedUserId ? (
              messages.map((message, i) => (
                <Box
                  key={message.id || `${message.senderId}-${message.createdAt}-${i}`}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.senderId === adminId ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "75%",
                      bgcolor: message.senderId === adminId ? "#1976d2" : "#e0e0e0",
                      color: message.senderId === adminId ? "white" : "black",
                      borderRadius: 2,
                      p: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {/* Show image if applicable */}
                    {message.file?.type?.startsWith("image/") && (
                      <img
                        src={message.file.data}
                        alt={message.file.name}
                        style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 8 }}
                      />
                    )}

                    {/* Show file name if not image */}
                    {message.file && !message.file.type?.startsWith("image/") && (
                      <Typography variant="body2">📎 {message.file.name}</Typography>
                    )}

                    {/* Audio */}
                    {message.audio && (
                      <IconButton onClick={() => playAudio(message.audio)}>
                        ▶️
                      </IconButton>
                    )}

                    {/* Message text */}
                    <Typography variant="body1">{message.message}</Typography>
                    <Typography variant="caption" sx={{ fontSize: 10, opacity: 0.6 }}>
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography sx={{ mt: 4, textAlign: "center", color: "#aaa" }}>
                Select a user to start chatting
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          {selectedUserId && (
            <Box sx={{ p: 2, bgcolor: "#fff" }}>
              <Paper
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMsg();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 20,
                  p: 1,
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
                  placeholder="Type a message"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  sx={{
                    ml: 1,
                    flex: 1,
                    bgcolor: '#fff',
                    borderRadius: 20,
                    px: 2,
                    py: 1,
                    fontSize: 16,
                  }}
                />
                {msg.trim() || file ? (
                  <IconButton type="submit" color="primary">
                    <SendIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={openMic}
                    color={isRecording ? "error" : "default"}
                  >
                    <MicIcon />
                  </IconButton>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminChat;
