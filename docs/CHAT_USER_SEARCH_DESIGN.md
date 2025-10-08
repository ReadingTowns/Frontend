# 📋 Chat User Search Feature - Design Specification

## 🎯 Overview

**Feature**: 채팅방에 유저 검색 기능 추가
**Scope**: 새로운 대화 시작을 위한 사용자 검색 및 채팅 생성
**Integration**: 직접 API 연결 (Real API endpoints)

## 🏗️ System Architecture

### Current Chat System Analysis
```
📱 Chat System Structure:
├── ChatClient.tsx          # Main hub (conversation selection)
├── ChatList.tsx            # Existing conversations list
├── ChatRoomClient.tsx      # Individual chat room
└── Components/
    ├── MessageBubble.tsx
    └── MessageInput.tsx
```

### Integration Points
- **Entry Point**: "새 대화 시작하기" button in ChatList.tsx
- **API Integration**: Direct connection to `/api/v1/members/search` and `/api/v1/chatrooms`
- **State Management**: TanStack Query for API state management

## 🔄 User Flow Design

### 1. **Search Entry Flow**
```
ChatList → [새 대화 시작하기] → UserSearchModal → UserResults → ChatInitiation
```

### 2. **Detailed User Journey**
1. **Trigger**: User clicks "새 대화 시작하기" button
2. **Search Modal**: Full-screen modal with search input
3. **Real-time Search**: As user types → API call to `/api/v1/members/search?nickname={query}`
4. **User Selection**: User selects from search results
5. **Book Selection**: Choose book for exchange (from user's library)
6. **Chat Creation**: API call to `/api/v1/chatrooms` to create conversation
7. **Navigation**: Redirect to new chat room

## 📡 API Integration Design

### Search API Pattern
```typescript
// User Search API
GET /api/v1/members/search?nickname={searchQuery}

Response Structure:
{
  "code": "1000",
  "message": "Success",
  "result": [
    {
      "memberId": "123",
      "nickname": "김독서",
      "profileImage": "https://...",
      "town": "강남구 역삼동",
      "rating": 4.8,
      "exchangeCount": 12
    }
  ]
}
```

### Chat Creation API Pattern
```typescript
// Create New Chatroom
POST /api/v1/chatrooms

Request Body:
{
  "partnerId": "123",
  "myBookId": "book456",
  "partnerBookId": "book789" // Optional
}

Response:
{
  "code": "1000",
  "message": "Success",
  "result": {
    "chatroomId": "chatroom_001",
    "partnerId": "123",
    "partnerName": "김독서",
    "bookTitle": "미움받을 용기"
  }
}
```

## 🧩 Component Specifications

### 1. **UserSearchModal Component**
```typescript
interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onUserSelect: (user: SearchUser) => void
}

Features:
- Full-screen overlay modal
- Real-time search with debouncing (300ms)
- Loading states and empty states
- Error handling for API failures
```

### 2. **UserSearchInput Component**
```typescript
interface UserSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  isLoading: boolean
}

Features:
- Search icon and clear button
- Loading indicator during API calls
- Minimum 2 characters for search trigger
```

### 3. **UserResultCard Component**
```typescript
interface UserResultCardProps {
  user: SearchUser
  onSelect: (user: SearchUser) => void
}

Display Elements:
- Profile image (with fallback avatar)
- Nickname and town information
- Star rating and exchange count
- "대화 시작" button
```

### 4. **BookSelectionModal Component**
```typescript
interface BookSelectionModalProps {
  selectedUser: SearchUser
  onBookSelect: (bookId: string) => void
  onCancel: () => void
}

Features:
- User's book library grid
- Book selection for exchange proposal
- "교환하지 않고 대화하기" option
```

## 📊 Data Models

### SearchUser Interface
```typescript
interface SearchUser {
  memberId: string
  nickname: string
  profileImage?: string
  town: string
  rating: number
  exchangeCount: number
  isFollowing?: boolean
}
```

### Chat Creation Request
```typescript
interface CreateChatRequest {
  partnerId: string
  myBookId?: string
  partnerBookId?: string
  initialMessage?: string
}
```

## 🎨 UI/UX Design

### Design System Integration
- **Colors**: Primary (#AFD6F8), Secondary (#B8DBDE)
- **Mobile-first**: 430px max-width constraint
- **Typography**: Consistent with existing chat system

### Modal Design Specifications
```css
UserSearchModal:
- Background: rgba(0,0,0,0.5) overlay
- Content: White container with rounded corners
- Height: 80vh with scroll for results
- Animation: Slide up from bottom (mobile)

Search Input:
- Height: 48px with padding
- Border: Focus ring in primary color
- Icon: 🔍 search, ✕ clear buttons

User Cards:
- Height: 72px with 16px padding
- Hover: Subtle gray background
- Layout: Avatar (48px) + Info + Action button
```

### Responsive Behavior
- **Mobile**: Full-screen modal with slide-up animation
- **Desktop**: Centered modal (max-width: 430px)
- **Tablet**: Adapted spacing and touch targets

## ⚡ Performance Optimizations

### Search Performance
- **Debouncing**: 300ms delay for API calls
- **Minimum Query**: 2 characters before search
- **Caching**: TanStack Query cache for repeated searches
- **Infinite Scroll**: For large result sets (future enhancement)

### State Management
```typescript
// TanStack Query Integration
const { data, isLoading, error } = useQuery({
  queryKey: ['userSearch', searchQuery],
  queryFn: () => searchUsers(searchQuery),
  enabled: searchQuery.length >= 2,
  staleTime: 30000, // 30 seconds cache
})
```

## 🔒 Security & Validation

### Input Validation
- **Search Query**: Sanitize and trim input
- **Rate Limiting**: Prevent API abuse (client-side throttling)
- **Error Handling**: Graceful degradation for API failures

### Privacy Considerations
- **User Consent**: Clear indication of search functionality
- **Data Protection**: No storage of search history
- **Authentication**: Ensure user is logged in before search

## 📱 Implementation Phases

### Phase 1: Core Search (Week 1)
- [ ] UserSearchModal component
- [ ] Real-time search API integration
- [ ] Basic user result display
- [ ] Chat creation without book selection

### Phase 2: Enhanced Features (Week 2)
- [ ] Book selection integration
- [ ] User profile preview
- [ ] Search history and suggestions
- [ ] Advanced filtering options

### Phase 3: Performance & Polish (Week 3)
- [ ] Infinite scroll for results
- [ ] Search analytics
- [ ] Accessibility improvements
- [ ] Error recovery mechanisms

## 🧪 Testing Strategy

### Unit Tests
- UserSearchModal component rendering
- Search input debouncing logic
- API error handling scenarios
- User selection flow validation

### Integration Tests
- Full search-to-chat creation flow
- API integration with real endpoints
- Modal interactions and navigation
- Book selection integration

### E2E Tests (Playwright)
- Complete user search journey
- Error states and recovery
- Mobile and desktop experiences
- Performance under load

## 📈 Success Metrics

### User Experience Metrics
- **Search Success Rate**: % searches resulting in chat creation
- **Search Speed**: Average time from query to results
- **Conversion Rate**: % users who complete chat creation
- **User Satisfaction**: Rating of search experience

### Technical Metrics
- **API Response Time**: <200ms for search results
- **Error Rate**: <1% for API calls
- **Cache Hit Rate**: >70% for repeated searches
- **Bundle Size**: Minimal impact on overall app size

## 🚀 Implementation Ready Design

The user search feature design is **ready for implementation** with:

✅ **Complete API Integration Plan**: Direct connection to existing `/api/v1/members/search` and `/api/v1/chatrooms` endpoints

✅ **Detailed Component Architecture**: 4 main components with full TypeScript interfaces and specifications

✅ **User Experience Flow**: Step-by-step journey from search trigger to chat creation

✅ **Performance Strategy**: Debouncing, caching, and optimization patterns defined

✅ **Mobile-First Design**: Consistent with existing 430px max-width constraint

✅ **Testing Strategy**: Unit, integration, and E2E test plans

The design leverages the existing TanStack Query infrastructure and follows the established patterns in the chat system while adding comprehensive user search capabilities that integrate seamlessly with the book exchange flow.

---

## 📚 Related Documentation

- [API Specification](./API_SPECIFICATION.md) - Complete API endpoint documentation
- [Chat Design](./chat-design.md) - Original chat system design
- [Project README](../README.md) - Overall project setup and guidelines

## 📝 Document Info

- **Created**: 2025-01-20
- **Last Updated**: 2025-01-20
- **Version**: 1.0
- **Author**: Claude Code Design System