MapleJS
========
MapleStory v83 private server based on [diamondo25's Maple.js](https://github.com/diamondo25/Maple.js). It's in the process of being rewritten in Typescript so it doesn't have all the features that Maple.js has yet.


Getting Started
========
Install dependencies

```
yarn
```

Create a `nx` folder and put in the following files (you must obtain these yourself):

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

Copy `config/server.sample.json` and rename it to `config/server.json`. Modify it as you see fit.

Start a mongodb server and make sure the connection string in `config/server.json` is correct (if you prefer docker, there is a docker-compose.yml file you can use)

Start the servers

```
yarn start
```

FEATURES
========
- Login
- Character creation
- Character deletion
- PIC creation

TODO
========
- Channel server