# IIIntl One Platform

## Current State
The platform has Users, Organizations, and Campaigns backend modules live and integrated. The frontend Forums pages (ForumsPage.tsx and ForumDetailPage.tsx) exist with mock data. The backend.d.ts has Campaign, Organization, and UserProfile types with corresponding CRUD methods.

## Requested Changes (Diff)

### Add
- Forums Motoko backend module: threads, replies, categories, pinning, locking, archiving
- Backend API methods: createThread, replyToThread, listThreads, getThread, listReplies, pinThread, lockThread, archiveThread
- Forum data types: ForumThread, ForumReply, ForumCategory, ThreadStatus
- Wire ForumsPage and ForumDetailPage to real backend APIs

### Modify
- backend.d.ts -- add Forum types and interface methods
- ForumsPage.tsx -- replace mock data with live backend calls
- ForumDetailPage.tsx -- replace mock data with live backend calls

### Remove
- Mock forum data from frontend pages

## Implementation Plan
1. Generate Motoko Forums backend module
2. Update frontend Forums pages to use real backend APIs
3. Validate and deploy
