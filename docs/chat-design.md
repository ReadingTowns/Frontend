# Chat System Design - ReadingTown

## Overview
A real-time chat system for book exchange negotiations using Notion as the backend database.

## Architecture

### 1. Data Model (Notion Database Structure)

#### Conversations Database
```
Properties:
- title (Title): Conversation identifier
- participants (People): Users in the conversation
- bookId (Text): Associated book ID
- bookTitle (Text): Book being discussed
- lastMessage (Text): Preview of last message
- lastMessageTime (Date): Timestamp of last activity
- status (Select): active | archived | completed
- createdAt (Created time)
- updatedAt (Last edited time)
```

#### Messages Database
```
Properties:
- content (Text/Rich text): Message content
- conversationId (Relation): Link to conversation
- senderId (Text): User ID who sent message
- senderName (Text): Display name
- messageType (Select): text | image | location | book_info
- readBy (Multi-select): User IDs who read the message
- createdAt (Created time)
- attachments (Files): Images or documents
```

### 2. API Integration Pattern

```typescript
// Polling Strategy for Real-time Updates
interface ChatService {
  // Create new conversation
  createConversation(bookId: string, participantIds: string[]): Promise<Conversation>

  // Send message
  sendMessage(conversationId: string, content: string): Promise<Message>

  // Get conversations list
  getConversations(userId: string): Promise<Conversation[]>

  // Get messages with polling
  getMessages(conversationId: string, lastSyncTime?: Date): Promise<Message[]>

  // Mark messages as read
  markAsRead(messageIds: string[], userId: string): Promise<void>
}
```

### 3. Real-time Simulation
- **Polling Interval**: 2-3 seconds for active chat
- **Long Polling**: 30 seconds for inactive chat
- **Optimistic Updates**: Show message immediately, sync later
- **Offline Queue**: Store messages locally when offline

### 4. UI Components

#### Chat List View
- List of all conversations
- Unread message badges
- Last message preview
- Search functionality

#### Chat Room View
- Message bubbles (sender/receiver)
- Typing indicators (simulated)
- Message status (sent/delivered/read)
- Quick actions (book info, schedule meet)

#### Message Input
- Text input with emoji support
- Image upload capability
- Quick replies for common responses
- Book exchange action buttons

## Implementation Phases

### Phase 1: Basic Chat (Week 1)
- [ ] Notion database setup
- [ ] Basic message send/receive
- [ ] Conversation list
- [ ] Simple polling

### Phase 2: Enhanced Features (Week 2)
- [ ] Image sharing
- [ ] Read receipts
- [ ] Search messages
- [ ] Notification system

### Phase 3: Book Exchange Features (Week 3)
- [ ] Exchange proposal templates
- [ ] Meeting scheduler integration
- [ ] Book information cards
- [ ] Exchange status tracking

## Technical Considerations

### Performance
- Implement virtual scrolling for long conversations
- Cache messages locally using IndexedDB
- Lazy load older messages
- Compress images before upload

### Security
- Validate user permissions per conversation
- Sanitize message content
- Rate limiting on message sending
- Encrypted local storage for sensitive data

### Offline Support
- Queue messages when offline
- Sync when connection restored
- Show offline indicator
- Conflict resolution for simultaneous edits

## UI/UX Guidelines

### Design Principles
1. **Simplicity**: Clean, minimal interface
2. **Speed**: Instant feedback on actions
3. **Clarity**: Clear message status indicators
4. **Mobile-first**: Optimized for 430px width

### Color Scheme
- Primary (Blue): #AFD6F8
- Secondary (Teal): #B8DBDE
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

### Typography
- Message text: 14px
- Timestamp: 12px (gray-500)
- Sender name: 13px (font-medium)

## API Routes Implementation

```typescript
// Next.js API Routes Structure
/api/v1/chat/
├── conversations/
│   ├── route.ts         // GET list, POST create
│   └── [id]/
│       ├── route.ts     // GET details, DELETE
│       └── messages/
│           └── route.ts // GET messages, POST send
├── messages/
│   └── [id]/
│       └── read/
│           └── route.ts // POST mark as read
└── upload/
    └── route.ts        // POST upload images
```

## Testing Strategy

### Unit Tests
- Message formatting utilities
- Time formatting functions
- Polling logic
- Cache management

### Integration Tests
- Notion API integration
- Message sending flow
- Conversation creation
- Real-time updates

### E2E Tests (Playwright)
- Complete chat flow
- Message delivery
- Notification system
- Offline/online transitions