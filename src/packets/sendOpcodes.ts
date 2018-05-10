export enum SendOpcode {
  ADD_NEW_CHAR_ENTRY = 0x0e,
  ALLIANCE_OPERATION = 0x42,
  ALL_CHARLIST = 0x08,
  APPLY_MONSTER_STATUS = 0xf2,
  ARAN_COMBO_COUNTER = 0xe1,
  ARIANT_CATCH_RESULT = 0x4f,
  ARIANT_SCOREBOARD = 0x9b,
  ARIANT_THING = 0xf8,
  AUTO_HP_POT = 0x152,
  AUTO_MP_POT = 0x153,
  AVATAR_MEGA = 0x6f,
  BAMBOO_USED = 0x5c,
  BBS_OPERATION = 0x3b,
  BLANK_MESSAGE = 0x65,
  BLOCK_PORTAL = 0x8b,
  BLOCK_PORTAL_SHOP = 0x8c,
  BOAT_EFFECT = 0x95,
  BOMB_EXPLOSION = 0xcc,
  BOSS_ENV = 0x8a,
  BOSS_YELLOW_TEXT = 0xfd,
  BUDDYLIST = 0x3f,
  CANCEL_BUFF = 0x21,
  CANCEL_CHAIR = 0xcd,
  CHAR_SELECT = 0x13,
  CANCEL_FOREIGN_BUFF = 0xc8,
  CANCEL_MONSTER_STATUS = 0xf3,
  CANCEL_SKILL_EFFECT = 0xbf,
  CATCH_ARIANT = 0xfc,
  CATCH_MOUNT = 0xfb,
  CHALKBOARD = 0xa4,
  CHANGE_CHANNEL = 0x10,
  CHANNEL_SELECTED = 0x14,
  CHARLIST = 0x0b,
  CHAR_INFO = 0x3d,
  CHAR_NAME_RESPONSE = 0x0d,
  CHATTEXT = 0xa2,
  CLOCK = 0x93,
  CLOSE_RANGE_ATTACK = 0xba,
  COCONUT_EVENT_ENTER = 0x8d,
  CONFIRM_SHOP_TRANSACTION = 0x132,
  COOLDOWN = 0xea,
  CS_BLOCKED = 0x84,
  CS_OPEN = 0x7f,
  CS_OPERATION = 0x145,
  CS_UPDATE = 0x144,
  DAMAGE_MONSTER = 0xf6,
  DAMAGE_PLAYER = 0xc0,
  DAMAGE_SUMMON = 0xb3,
  DELETE_CHAR_RESPONSE = 0x0f,
  DESTROY_HIRED_MERCHANT = 0x10a,
  DOJO_WARP_UP = 0xcf,
  DROP_ITEM_FROM_MAPOBJECT = 0x10c,
  DUEY = 0x142,
  ENABLE_CS_0 = 0x12,
  ENABLE_RECOMMENDED = 0x1a,
  ENABLE_REPORT = 0x2f,
  ENABLE_TV = 0x157,
  ENERGY = 0x5a,
  FACIAL_EXPRESSION = 0xc1,
  FAME_RESPONSE = 0x26,
  FAMILY_ACTION = 0x48,
  FAMILY_GAIN_REP = 0x61,
  FAMILY_INVITE = 0x5e,
  FAMILY_MESSAGE = 0x5d,
  FAMILY_MESSAGE2 = 0x5f,
  FAMILY_SENIOR_MESSAGE = 0x5f,
  FAMILY_USE_REQUEST = 0x64,
  FINISH_SORT = 0x34,
  FINISH_SORT2 = 0x35,
  FORCED_MAP_EQUIP = 0x85,
  GENDER = 0x3a,
  GENDER_DONE = 0x04,
  GET_USERNAME = 0x02,
  GIVE_BUFF = 0x20,
  GIVE_FOREIGN_BUFF = 0xc7,
  GMEVENT_INSTRUCTIONS = 0x92,
  GM_PACKET = 0x90,
  GM_POLICE = 0x74,
  GM_WARNING = 0x98,
  GUILD_OPERATION = 0x41,
  HIT_SNOWBALL = 0x11a,
  HPQ_MOON = 0x8f,
  HT_SPAWN = 0x12e,
  KEYMAP = 0x14f,
  KILL_MONSTER = 0xed,
  KITE = 0x10f,
  KITE_MESSAGE = 0x10e,
  KOREAN_EVENT = 0xdb,
  LEFT_KNOCK_BACK = 0x11c,
  LIE_DETECTOR = 0x2b,
  LOAD_FAMILY = 0x60,
  LOGIN_STATUS = 0x00,
  LUCKSACK_FAIL = 0xd1,
  LUCKSACK_PASS = 0xd0,
  MAGIC_ATTACK = 0xbc,
  MAP_EFFECT = 0x8e,
  MESO_BAG_MESSAGE = 0xd2,
  MESO_LIMIT = 0x39,
  MESSAGE_CANNOT_USE = 0x89,
  MESSENGER = 0x139,
  MODIFY_INVENTORY_ITEM = 0x1d,
  MONSTERBOOK_ADD = 0x53,
  MONSTER_BOOK_CHANGE_COVER = 0x54,
  MONSTER_CARNIVAL_MESSAGE = 0x125,
  MONSTER_CARNIVAL_PARTY_CP = 0x12a,
  MONSTER_CARNIVAL_PLAYER_CP = 0x12b,
  MONSTER_CARNIVAL_PLAYER_DIED = 0x126,
  MONSTER_CARNIVAL_PLAYER_LEFT = 0x127,
  MONSTER_CARNIVAL_START = 0x129,
  MONSTER_CARNIVAL_SUMMON = 0x128,
  MOVE_MONSTER = 0xef,
  MOVE_MONSTER_RESPONSE = 0xf0,
  MOVE_PET = 0xaa,
  MOVE_PLAYER = 0xb9,
  MOVE_SUMMON = 0xb1,
  MTS_OPEN = 0x7e,
  MTS_OPERATION = 0x15c,
  MTS_OPERATION2 = 0x15b,
  MULTICHAT = 0x86,
  NAME_CANCEL_WITHOUT_REQUEST = 0x7b,
  NAME_CHANGE_2 = 0x72,
  NAME_CHANGE_MESSAGE = 0x71,
  NEXON_SITE = 0x28,
  NPC_ACTION = 0x104,
  NPC_SPECIAL_ANIMATION = 0x105,
  NPC_TALK = 0x130,
  OPEN_FAMILY = 0x5c,
  OPEN_NPC_SHOP = 0x131,
  OPEN_STORAGE = 0x135,
  OWL_OF_MINERVA = 0x46,
  OX_QUIZ = 0x91,
  PARTY_OPERATION = 0x3e,
  PET_CHAT = 0xab,
  PET_COMMAND = 0xae,
  PET_NAMECHANGE = 0xac,
  PET_SHOW = 0xad,
  PING = 0x11,
  PIN_ASSIGNED = 0x07,
  PIN_OPERATION = 0x06,
  PLAYER_HINT = 0xd6,
  PLAYER_INTERACTION = 0x13a,
  PLAYER_LEVEL = 0x63,
  PLAYER_NPC = 0x51,
  PLAYER_NPC_SHOW = 0x4e,
  QUICK_SLOT_CHANGE = 0x9f,
  RANGED_ATTACK = 0xbb,
  REACTOR_DESTROY = 0x118,
  REACTOR_HIT = 0x115,
  REACTOR_SPAWN = 0x117,
  RELOG_RESPONSE = 0x16,
  REMOVE_DOOR = 0x114,
  REMOVE_ITEM_FROM_MAP = 0x10d,
  REMOVE_MIST = 0x112,
  REMOVE_NPC = 0x102,
  REMOVE_PLAYER_FROM_MAP = 0xa1,
  REMOVE_SPECIAL_MAPOBJECT = 0xb0,
  REMOVE_TEMP_STATS = 0x23,
  REMOVE_TIGER = 0x70,
  REMOVE_TV = 0x156,
  REPORTREPLY = 0x38,
  REPORT_RESPONSE = 0x2c,
  RESET_SCREEN = 0x82,
  ROLL_SNOWBALL = 0x119,
  SEND_RECOMMENDED = 0x1b,
  SEND_TITLE_BOX = 0x32,
  SEND_TV = 0x155,
  SERVERLIST = 0x0a,
  SERVERMESSAGE = 0x44,
  SERVERSTATUS = 0x03,
  SERVER_IP = 0x0c,
  SHOW_CHAIR = 0xc4,
  SHOW_EQUIP_EFFECT = 0x34,
  SHOW_FOREIGN_EFFECT = 0xc6,
  SHOW_INFO = 0x7a,
  SHOW_ITEM_EFFECT = 0xc2,
  SHOW_ITEM_GAIN_INCHAT = 0xce,
  SHOW_MAGNET = 0xfe,
  SHOW_MONSTER_HP = 0xfa,
  SHOW_NOTES = 0x29,
  SHOW_PEDIGREE = 0x5b,
  SHOW_QUEST_COMPLETION = 0x31,
  SHOW_SCROLL_EFFECT = 0xa7,
  SHOW_STATUS_INFO = 0x27,
  SILVER_BOX = 0x79,
  SKILL_EFFECT = 0xbe,
  SKILL_MACRO = 0x7c,
  SNOWBALL_MESSAGE = 0x11b,
  SOUND = 0xd8,
  SPAWN_DOOR = 0x113,
  SPAWN_HIRED_MERCHANT = 0x109,
  SPAWN_MIST = 0x111,
  SPAWN_MONSTER = 0xec,
  SPAWN_MONSTER_CONTROL = 0xee,
  SPAWN_NPC = 0x101,
  SPAWN_NPC_REQUEST_CONTROLLER = 0x103,
  SPAWN_PET = 0xa8,
  SPAWN_PLAYER = 0xa0,
  SPAWN_PORTAL = 0x43,
  SPAWN_SPECIAL_MAPOBJECT = 0xaf,
  SPOUSE_CHAT = 0x88,
  STOP_CLOCK = 0x9a,
  SUMMON_ATTACK = 0xb2,
  SUMMON_SKILL = 0xb3,
  TOS = 0x05,
  TROCK_LOCATIONS = 0x2a,
  TUTORIAL_GUIDE = 0xe0,
  TUTORIAL_INTRO_DISABLE_UI = 0xde,
  TUTORIAL_INTRO_LOCK = 0xdd,
  TUTORIAL_SUMMON = 0xdf,
  UNABLE_TO_CONNECT = 0x124,
  UNKNOWN_MESSAGE = 0x73,
  UPDATE_CHAR_BOX = 0xa5,
  UPDATE_CHAR_LOOK = 0xc5,
  UPDATE_GUILD_EMBLEM = 0xcb,
  UPDATE_GUILD_NAME = 0xca,
  UPDATE_HIRED_MERCHANT = 0x10b,
  UPDATE_INVENTORY_SLOTS = 0x1e,
  UPDATE_MOUNT = 0x30,
  UPDATE_PARTYMEMBER_HP = 0xc9,
  UPDATE_QUEST_INFO = 0xd3,
  UPDATE_SKILLS = 0x24,
  UPDATE_STATS = 0x1f,
  UPDATE_TEMP_STATS = 0x22,
  USE_SKILL_BOOK = 0x33,
  VICIOUS_HAMMER = 0x162,
  WARP_TO_MAP = 0x7d,
  WEDDING_MESSAGE = 0x4a,
  WEDDING_PROPOSAL = 0x49,
  WHISPER = 0x87,
  WRONG_PIC = 0x1c,
  YELLOW_TIP = 0x4d,
  ZAKUM_SHRINE = 0x12f
}