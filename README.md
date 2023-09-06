# Material Ships Server

## Setup

### Requirements

1. Docker

### Development

1. Install dependencies with `npm install`.
1. Create `.env` file using `.env.template` as a template.
1. Start mongodb server instance using `docker compose up`.
1. Start server with `npm dev`.

### Building prod version

1. Build server with `npm build`.
1. Start server with `npm start`.

## Tips

1. Source maps are required for debugging.
1. Checking for user status (online/offline) and therefore for socket connection is not required, because everything is stored in database anyway. When user will reconnect, he will return to game and get all required data.
