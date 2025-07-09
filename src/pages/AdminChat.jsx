import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Typography,
  useMediaQuery,
  Divider,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from '@mui/icons-material/Search';

const mockUsers = [
  {
    id: "u1",
    name: "Alice",
    avatar: "",
    lastMessage: "Can you help me?",
  },
  {
    id: "u2",
    name: "Bob",
    avatar: "",
    lastMessage: "Thanks for your support!",
  },
  {
    id: "u3",
    name: "Charlie",
    avatar: "",
    lastMessage: "I have a problem.",
  },
];

const initialMessages = {
  u1: [
    {
      id: 1,
      message: "Can you help me?",
      user: "user",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      message: "Hello Alice! How can I help you?",
      user: "admin",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  u2: [
    {
      id: 1,
      message: "Thanks for your support!",
      user: "user",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      message: "You're welcome, Bob!",
      user: "admin",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  u3: [
    {
      id: 1,
      message: "I have a problem.",
      user: "user",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      message: "Hi Charlie, please describe your problem.",
      user: "admin",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
};

const AdminChat = () => {
  const [users] = useState(mockUsers);
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [messages, setMessages] = useState(initialMessages);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [showUserListMobile, setShowUserListMobile] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUserId]);

  useEffect(() => {
    if (isMobile) {
      setShowUserListMobile(true);
    }
  }, [isMobile]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowUserListMobile(false);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const sendMsg = () => {
    if (msg.trim() || file) {
      const newMessage = {
        id: Date.now(),
        message: msg.trim(),
        user: "admin",
        timestamp: new Date().toLocaleTimeString(),
        file: file,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
      }));
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

  // For demo: add voice message as admin
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
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setIsRecording(false);
        const newMessage = {
          id: Date.now(),
          message: "Voice Message",
          user: "admin",
          timestamp: new Date().toLocaleTimeString(),
          audio: blob,
        };
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
        }));
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

  // Responsive layout
  return (
    <Box sx={{ display: "flex", bgcolor: "#f9f9f9" }}>
      {isMobile ? (
        showUserListMobile ? (
          // MOBILE: Show only user list
          <Box
            sx={{
              width: "100vw",
              minHeight: "80vh",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              overflow: "scroll",
              scrollbarWidth: "none"
            }}
          >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                Users
              </Typography>
              <Box sx={{ position: "relative", maxWidth: 200, width: "100%" }}>
                <InputBase
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  sx={{
                    width: "100%",
                    borderRadius: 20,
                    background: "#f5f5f5",
                    px: 2,
                    py: 0.5,
                    boxShadow: 1,
                    fontSize: 15,
                    pl: 4,
                  }}
                  inputProps={{ style: { paddingLeft: 24 } }}
                />
                <SearchIcon sx={{ position: "absolute", left: 10, top: 10, color: '#888', fontSize: 20, pointerEvents: 'none' }} />
              </Box>
            </Box>
            <Divider />
            <List sx={{ flex: 1, overflowY: "auto" }}>
              {filteredUsers.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  selected={user.id === selectedUserId}
                  onClick={() => handleUserClick(user.id)}
                  sx={{
                    alignItems: "flex-start",
                    px: 2,
                    py: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{user.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.lastMessage}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          // MOBILE: Show only chat area with back button
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "80vh",
              maxWidth: "100vw",
              bgcolor: "#f9f9f9",
            }}
          >
            {/* Chat Header with Back Button */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #eee",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                minHeight: 64,
              }}
            >
              <IconButton onClick={() => setShowUserListMobile(true)} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              
              </IconButton>
              <Avatar sx={{ mr: 2 }}>
                {users.find((u) => u.id === selectedUserId)?.name[0]}
              </Avatar>
              <Typography variant="h6">
                {users.find((u) => u.id === selectedUserId)?.name}
              </Typography>
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
              }}
            >
              {(messages[selectedUserId] || []).map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.user === "admin" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: { xs: "90%", sm: "70%" },
                      background:
                        message.user === "admin" ? "#1976d2" : "#f5f5f5",
                      color: message.user === "admin" ? "white" : "black",
                      padding: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      wordWrap: "break-word",
                      fontSize: { xs: 14, sm: 16 },
                    }}
                  >
                    {/* Show image if file is image */}
                    {message.file &&
                      message.file.type &&
                      message.file.type.startsWith("image/") && (
                        <Box sx={{ mb: 1 }}>
                          <img
                            src={URL.createObjectURL(message.file)}
                            alt={message.file.name}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: 8,
                              display: "block",
                            }}
                          />
                        </Box>
                      )}
                    {/* Show file name if not image */}
                    {message.file &&
                      (!message.file.type ||
                        !message.file.type.startsWith("image/")) && (
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "12px", opacity: 0.8 }}
                          >
                            📎 {message.file.name}
                          </Typography>
                        </Box>
                      )}
                    {message.audio && (
                      <Box sx={{ mb: 1 }}>
                        <IconButton
                          onClick={() => playAudio(message.audio)}
                          sx={{
                            background:
                              message.user === "admin"
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(0,0,0,0.1)",
                            color: message.user === "admin" ? "white" : "black",
                          }}
                        >
                          ▶️
                        </IconButton>
                      </Box>
                    )}
                    <Typography variant="body1">{message.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, fontSize: "10px" }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            {/* Input field */}
            <Box
              sx={{
                width: "100%",
                py: { xs: 1, sm: 2 },
                background: { xs: "#fff", sm: "transparent" },
                position: "sticky",
                bottom: 0,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "98%", sm: "80%", md: "60%", lg: "40%" },
                  }}
                >
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
        )
      ) : (
        // DESKTOP: Show both user list and chat area
        <>
          <Box
            sx={{
              width: 260,
              borderRight: "1px solid #eee",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Users</Typography>
            </Box>
            <Divider />
            <List sx={{ flex: 1, overflowY: "auto" }}>
              {users.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  selected={user.id === selectedUserId}
                  onClick={() => handleUserClick(user.id)}
                  sx={{
                    alignItems: "flex-start",
                    px: 2,
                    py: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{user.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.lastMessage}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "80vh",
              maxWidth: "100vw",
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #eee",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                minHeight: 64,
              }}
            >
              <Avatar sx={{ mr: 2 }}>
                {users.find((u) => u.id === selectedUserId)?.name[0]}
              </Avatar>
              <Typography variant="h6">
                {users.find((u) => u.id === selectedUserId)?.name}
              </Typography>
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
              }}
            >
              {(messages[selectedUserId] || []).map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.user === "admin" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: { xs: "90%", sm: "70%" },
                      background:
                        message.user === "admin" ? "#1976d2" : "#f5f5f5",
                      color: message.user === "admin" ? "white" : "black",
                      padding: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      wordWrap: "break-word",
                      fontSize: { xs: 14, sm: 16 },
                    }}
                  >
                    {/* Show image if file is image */}
                    {message.file &&
                      message.file.type &&
                      message.file.type.startsWith("image/") && (
                        <Box sx={{ mb: 1 }}>
                          <img
                            src={URL.createObjectURL(message.file)}
                            alt={message.file.name}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: 8,
                              display: "block",
                            }}
                          />
                        </Box>
                      )}
                    {/* Show file name if not image */}
                    {message.file &&
                      (!message.file.type ||
                        !message.file.type.startsWith("image/")) && (
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "12px", opacity: 0.8 }}
                          >
                            📎 {message.file.name}
                          </Typography>
                        </Box>
                      )}
                    {message.audio && (
                      <Box sx={{ mb: 1 }}>
                        <IconButton
                          onClick={() => playAudio(message.audio)}
                          sx={{
                            background:
                              message.user === "admin"
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(0,0,0,0.1)",
                            color: message.user === "admin" ? "white" : "black",
                          }}
                        >
                          ▶️
                        </IconButton>
                      </Box>
                    )}
                    <Typography variant="body1">{message.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, fontSize: "10px" }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            {/* Input field */}
            <Box
              sx={{
                width: "100%",
                py: { xs: 1, sm: 2 },
                background: { xs: "#fff", sm: "transparent" },
                position: "sticky",
                bottom: 0,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "98%", sm: "80%", md: "60%", lg: "40%" },
                  }}
                >
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
        </>
      )}
    </Box>
  );
};

export default AdminChat;

