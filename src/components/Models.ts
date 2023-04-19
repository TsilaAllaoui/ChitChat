export interface User {
  name: string,
  uid: string
};

// Type for a conversation object
export interface Conversation {
  participants: string[],
  hostName: string,
  hostId: string,
  otherName: string,
  otherId: string,
  id: string
};

// Sender and Receiver types
export interface Receiver {
  name: string;
  id: string;
};
export interface Sender extends Receiver{
};

// Type for a message object
export interface Message{ 
  message: string, 
  receiverId: string, 
  senderId: string, 
  id: string 
};