export interface User {
  name: string;
  uid: string;
}

export interface ID {
  name: string;
  uid: string;
}

// Type for a conversation object
export interface Conversation {
  participants: string[];
  hostName: string;
  hostId: string;
  guestName: string;
  guestId: string;
  id: string;
}

// Sender and Receiver types
export interface Receiver {
  name: string;
  id: string;
}
export interface Sender extends Receiver {}

// Type for a message object
export interface Message {
  message: string;
  receiverId: string;
  senderId: string;
  id: string;
  repliedContent: string;
}

export interface UserInFirebase {
  name: string;
  id: string;
  email: string;
}
