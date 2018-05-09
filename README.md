MapleJS
========

MapleStory v83 private server based on diamondo25's Maple.js

Installing
========

Edit `serverConfig.json` to your needs. Note the `publicIP` values; this IP is sent to the client on selecting character/changing channel

Install dependencies

```
yarn
```

Create a `nx` folder and put in the following files:

```
Character.nx
Etc.nx
Item.nx
Map.nx
Npc.nx
Reactor.nx
Skill.nx
String.nx
```
(you must create them yourself by converting Maplestory v83's .wz files into .nx files)

Start mongodb server on port 27017 or start one with the docker container

```
yarn db
```

Start the server

```
yarn dev
```

The server should be ready to use now.


TODO
========

# Progress
- World selection
- Character selection
- Character creation
- PIC?
- Mob spawn