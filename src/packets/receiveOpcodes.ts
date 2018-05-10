export enum ReceiveOpcode {
  ACCEPT_FAMILY = 0x96,
  ADD_FAMILY = 0x93,
  ADMIN_COMMAND = 0x80,
  ADMIN_LOG = 0x81,
  ADMIN_MESSENGER = 0xf5,
  AFTER_LOGIN = 0x09,
  ALLIANCE_DENIED = 0x90,
  ALLIANCE_OPERATION = 0x8f,
  ARAN_COMBO = 0xa3,
  AUTO_AGGRO = 0xbd,
  AUTO_DISTRIBUTE_AP = 0x58,
  BBS_OPERATION = 0x9b,
  BEHOLDER = 0xb2,
  BUDDYLIST_MODIFY = 0x82,
  BUY_CS_ITEM = 0xe5,
  CANCEL_BUFF = 0x5c,
  CANCEL_CHAIR = 0x2a,
  CANCEL_DEBUFF = 0x63,
  CANCEL_ITEM_EFFECT = 0x49,
  CHANGE_CHANNEL = 0x27,
  CHANGE_KEYMAP = 0x87,
  CHANGE_MAP = 0x26,
  CHANGE_MAP_SPECIAL = 0x64,
  CHARLIST_REQUEST = 0x05,
  CHAR_INFO_REQUEST = 0x61,
  CHAR_SELECT = 0x13,
  CHAR_SELECT_WITH_PIC = 0x1e,
  CHECK_CHAR_NAME = 0x15,
  CLIENT_ERROR = 0x1b,
  CLIENT_START = 0x19,
  CLOSE_CHALKBOARD = 0x32,
  CLOSE_ITEMUI = 0xec,
  CLOSE_RANGE_ATTACK = 0x2c,
  COUPON_CODE = 0xe6,
  CREATE_CHAR = 0x16,
  DAMAGE_REACTOR = 0xcd,
  DAMAGE_SUMMON = 0xb1,
  DELETE_CHAR = 0x17,
  DENY_GUILD_REQUEST = 0x7f,
  DENY_PARTY_REQUEST = 0x7d,
  DISTRIBUTE_AP = 0x57,
  DISTRIBUTE_SP = 0x5a,
  DUEY_ACTION = 0x41,
  ENERGY_ORB_ATTACK = 0x2f,
  ENTER_CASH_SHOP = 0x28,
  ENTER_MTS = 0x9c,
  ENTER_MYSTIC_DOOR = 0x83,
  ERROR = 0x1a,
  FACE_EXPRESSION = 0x33,
  GENERAL_CHAT = 0x31,
  GIVE_FAME = 0x5f,
  GUILD_OPERATION = 0x7e,
  HEAL_OVER_TIME = 0x59,
  HIRED_MERCHANT_REQUEST = 0x3f,
  ITEM_MOVE = 0x47,
  ITEM_PICKUP = 0xca,
  ITEM_SORT = 0x45,
  ITEM_SORT2 = 0x46,
  LOGIN_PASSWORD = 0x01,
  MAGIC_ATTACK = 0x2e,
  MAKER_SKILL = 0x72,
  MESO_DROP = 0x5e,
  MESSENGER = 0x7a,
  MOB_DAMAGE_MOB = 0xc2,
  MOB_DAMAGE_MOB_FRIENDLY = 0xc0,
  MONSTER_BOMB = 0xc1,
  MONSTER_BOOK_COVER = 0x39,
  MONSTER_CARNIVAL = 0xda,
  MOVE_LIFE = 0xbc,
  MOVE_PET = 0xa7,
  MOVE_PLAYER = 0x29,
  MOVE_SUMMON = 0xaf,
  MTS_OP = 0xfb,
  NOTE_ACTION = 0x84,
  NPC_ACTION = 0xc5,
  NPC_SHOP = 0x3d,
  NPC_TALK = 0x3a,
  NPC_TALK_MORE = 0x3c,
  OPEN_FAMILY = 0x92,
  OPEN_ITEMUI = 0xeb,
  OPEN_TREASURE = 0x70,
  PARTYCHAT = 0x77,
  PARTY_OPERATION = 0x7c,
  PARTY_SEARCH_REGISTER = 0xdc,
  PARTY_SEARCH_START = 0xde,
  PET_AUTO_POT = 0xab,
  PET_CHAT = 0xa8,
  PET_COMMAND = 0xa9,
  PET_EXCLUDE_ITEMS = 0xac,
  PET_FOOD = 0x4c,
  PET_LOOT = 0xaa,
  PET_TALK = 0x9d,
  PICK_ALL_CHAR = 0x0e,
  PLAYER_DC = 0x0c,
  PLAYER_INTERACTION = 0x7b,
  PLAYER_LOGGEDIN = 0x14,
  PLAYER_UPDATE = 0xdf,
  POISON_BOMB = 0x6d,
  PONG = 0x18,
  PROMPT_PIC_ALL_CHAR = 0x20,
  QUEST_ACTION = 0x6b,
  QUICK_SLOT_CHANGE = 0xb7,
  RANGED_ATTACK = 0x2d,
  REGISTER_PIC = 0x1d,
  REGISTER_PIC_ALL_CHAR = 0x1f,
  REGISTER_PIN = 0x0a,
  RELOG = 0x1c,
  REMOTE_SHOP = 0x3b,
  REPORT = 0x6a,
  RING_ACTION = 0x89,
  SCRIPTED_ITEM = 0x4e,
  SEE_ALL_CHAR = 0x0f,
  SERVERLIST_REQUEST = 0x0b,
  SERVERLIST_REREQUEST = 0x04,
  SERVERSTATUS_REQUEST = 0x06,
  SET_GENDER = 0x08,
  SKILL_EFFECT = 0x5d,
  SKILL_MACRO = 0x6e,
  SOMETHING = 0x6f,
  SPAWN_PET = 0x62,
  SPECIAL_MOVE = 0x5b,
  SPOUSE_CHAT = 0x79,
  STORAGE = 0x3e,
  SUMMON_ATTACK = 0xb0,
  TAKE_DAMAGE = 0x30,
  TOUCHING_CS = 0xec,
  TOUCHING_REACTOR = 0xce,
  TROCK_ADD_MAP = 0x66,
  UPDATE_CHAR_2 = 0xcf,
  USE_CASH_ITEM = 0x4f,
  USE_CATCH_ITEM = 0x51,
  USE_CHAIR = 0x2b,
  USE_DEATHITEM = 0x36,
  USE_DOOR = 0x85,
  USE_FAMILY = 0x97,
  USE_HAMMER = 0x104,
  USE_INNER_PORTAL = 0x65,
  USE_ITEM = 0x48,
  USE_ITEMEFFECT = 0x34,
  USE_ITEMUI = 0xed,
  USE_MAPLELIFE = 0xfe,
  USE_MOUNT_FOOD = 0x4d,
  USE_REMOTE = 0x74,
  USE_RETURN_SCROLL = 0x55,
  USE_SKILL_BOOK = 0x52,
  USE_SOLOMON_ITEM = 0x9e,
  USE_SUMMON_BAG = 0x4b,
  USE_TELEPORT_ROCK = 0x54,
  USE_UPGRADE_SCROLL = 0x56,
  VIEW_ALL_CHAR = 0x0d,
  WHISPER = 0x78
}