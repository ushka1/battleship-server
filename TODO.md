# TODO

## High Priority

1. Revenge.
1. Leave room.
1. Reconnect.
1. Use aggregation.
1. Improve logging.
1. Improve messaging.
1. Refactor.

1. Instead of using hardcoded PayloadState, refactor it to "action", you only inform user that something changed but "state" is not fully controlled on backend.
1. Room-level synchronization.
1. Transactions.

## Medium Priority

1. Private match.
1. Clear poolId after joining room.
1. Think about separating frontend state from backend.

## Low Priority

1. Socket authorization (+ account claim) -> another middleware, that can be stacket with existing one.
1. Socketio middleware - find guest-user/authenticate.
1. Rankings/stats.
1. Store.
1. Additional modes.
1. Remove inactive users after some time (e.g. 30 days).
1. Server down -> try to recreate everything, users will be unique so this may be possible.
