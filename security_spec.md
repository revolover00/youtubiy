# Security Specification

## 1. Data Invariants

1. User Profile documents at `/users/{userId}` can only be read or written by the authenticated user whose `request.auth.uid == userId`.
2. All subcollections (`subscriptions`, `history`, `liked`, `watchLater`) reside under `/users/{userId}/...` and can only be accessed by the authentic owner (`request.auth.uid == userId`).
3. Document IDs in subcollections must be valid identifiers (channelId or videoId matching regex and size limit).
4. Unauthenticated users cannot read or write any user data.
5. Users cannot write records into another user's collection or spoof user IDs.
6. A default-deny catch-all rule enforces zero-trust access across the entire database.

## 2. The Dirty Dozen Malicious Payloads

1. **Unauthenticated Read**: Attempt to read `/users/victim_123` without auth token.
2. **Unauthenticated Write**: Attempt to write to `/users/victim_123` without auth token.
3. **Cross-User Profile Write**: Attacker authenticated as `user_abc` attempts to overwrite `/users/user_xyz`.
4. **Cross-User Subscription Injection**: Attacker `user_abc` attempts to create `/users/user_xyz/subscriptions/channel_1`.
5. **Cross-User History Tampering**: Attacker `user_abc` attempts to delete `/users/user_xyz/history/video_1`.
6. **Cross-User Liked Videos Read**: Attacker `user_abc` attempts to list `/users/user_xyz/liked`.
7. **Cross-User Watch Later Write**: Attacker `user_abc` attempts to add to `/users/user_xyz/watchLater/video_1`.
8. **Invalid Long ID Poisoning**: Attempt to create document with 10KB junk characters as ID.
9. **Missing Required Fields**: Attempt to write `/users/{userId}` without required `userId` or `email`.
10. **Ghost Field Injection**: Attempt to write unexpected fields (`isAdmin: true`) to `/users/{userId}`.
11. **Catch-All Collection Probing**: Attempt to write to unauthorized collection `/system_secrets/config`.
12. **Root Document Access**: Attempt to query root level documents or unmapped paths.
