import { Chat, Project } from "./Schema.js";
import { v4 as uuid } from "uuid";

const SocketHandler = (socket) => {

  /* =======================
     FREELANCER JOIN ROOM
  ======================== */
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) return socket.emit("error", { message: "Project not found" });

      if (project.freelancerId === freelancerId) {
        socket.join(projectId);
        console.log(`👤 Freelancer joined room: ${projectId}`);
        socket.broadcast.to(projectId).emit("user-joined-room", { userType: "freelancer" });

        let chat = await Chat.findById(projectId);
        if (!chat) {
          chat = new Chat({ _id: projectId, messages: [] });
          await chat.save();
        }

        socket.emit("messages-updated", { chat });
      } else {
        socket.emit("error", { message: "Unauthorized to join this project" });
      }
    } catch (error) {
      console.error("Error in join-chat-room:", error);
      socket.emit("error", { message: "Failed to join chat room" });
    }
  });

  /* =======================
     CLIENT JOIN ROOM
  ======================== */
  socket.on("join-chat-room-client", async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) return socket.emit("error", { message: "Project not found" });

      if (["Assigned", "Completed"].includes(project.status)) {
        socket.join(projectId);
        console.log(`👤 Client joined room: ${projectId}`);
        socket.broadcast.to(projectId).emit("user-joined-room", { userType: "client" });

        let chat = await Chat.findById(projectId);
        if (!chat) {
          chat = new Chat({ _id: projectId, messages: [] });
          await chat.save();
        }

        socket.emit("messages-updated", { chat });
      } else {
        socket.emit("error", { message: "Cannot join chat for this project status" });
      }
    } catch (error) {
      console.error("Error in join-chat-room-client:", error);
      socket.emit("error", { message: "Failed to join chat room" });
    }
  });

  /* =======================
     FETCH / UPDATE MESSAGES
  ======================== */
  socket.on("update-messages", async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      if (!chat) return socket.emit("messages-updated", { chat: { messages: [] } });

      socket.emit("messages-updated", { chat });
    } catch (error) {
      console.error("Error updating messages:", error);
      socket.emit("error", { message: "Failed to fetch messages" });
    }
  });

  /* =======================
     SEND NEW MESSAGE
  ======================== */
  socket.on("new-message", async ({ projectId, senderId, message, time }) => {
    try {
      // Ensure chat exists
      let chat = await Chat.findById(projectId);
      if (!chat) {
        chat = new Chat({ _id: projectId, messages: [] });
      }

      // Add message
      chat.messages.push({ id: uuid(), text: message, senderId, time });
      await chat.save();

      console.log(`💬 New message in project ${projectId}:`, message);

      // Emit updated chat to sender
      socket.emit("messages-updated", { chat });

      // Broadcast to other users in the room
      socket.broadcast.to(projectId).emit("message-from-user", { chat });
    } catch (error) {
      console.error("Error adding new message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};

export default SocketHandler;
