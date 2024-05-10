import { Platform } from 'react-native';

export const IMAGES = {
  splash: { uri: 'splashscreen' },
  backArrow: { uri: 'backarrow' },
  loading: { uri: Platform.OS === 'ios' ? 'loading.gif' : 'loading' }, //need to add in ios
  typing: {
    uri: 'typing.gif',
  },
  phone: { uri: 'phone' },
  visible: { uri: 'visible' },
  invisible: { uri: 'invisible' },
  mail: { uri: 'mail' },
  avtar: { uri: 'avtar' },
  addIcon: { uri: 'add-icon' },
  clearIcon: { uri: 'clear-icon' },
  image1: { uri: 'image' },
  image: { uri: 'newsidelogo' },
  more: { uri: 'more_icon' },
  noChatImage: { uri: 'open_doodles_unboxing' },
  sortIcon: { uri: 'newsidelogo' },
  groupIcon: { uri: 'users_icon' },
  // BOTTOM TAB ICON
  HOME_TAB: { uri: 'home_tab' },
  CHATS_TAB: { uri: 'chats_tab' },
  EVENTS_TAB: { uri: 'events_tab' },
  TASKS_TAB: { uri: 'tasks_tab' },

  // BOTTOM ACTIVE TAB ICON
  HOME_TAB_ACTIVE: { uri: 'home_tab_active' },
  CHATS_TAB_ACTIVE: { uri: 'chats_tab_active' },
  EVENTS_TAB_ACTIVE: { uri: 'events_tab_active' },
  TASKS_TAB_ACTIVE: { uri: 'tasks_tab_active' },

  // Home
  open_doodles_laying_down: { uri: 'open_doodles_laying_down' },
  open_doodles_zombieing: { uri: 'open_doodles_zombieing' },
  open_doodles_zombieing2: { uri: 'open_doodles_zombieing2' },
  open_doodles_unboxing: { uri: 'open_doodles_loving' },

  // FAb
  fab: { uri: 'fab' },
  FAB_CHAT: { uri: 'fabchat' },
  FAB_EVENTS: { uri: 'fabevents' },
  FAB_TASKS: { uri: 'fabtasks' },

  imageShape: { uri: 'image-shape' },
  addIcon: { uri: 'add_icon' },
  clearIcon: { uri: 'clear_icon' },
  image: { uri: 'newsidenotelogo' },
  sidenote_logo: { uri: 'newsidenotelogo' },
  userIcon: { uri: 'users_group' },

  // Invite Screen
  openDoodlesLoving: { uri: 'open-doodles-loving' },
  search: { uri: 'search' },
  InviteIcon: { uri: 'invite_icon' },
  rightArrow: { uri: 'right_arrow' },
  shareIcon: { uri: 'share_icon' },
  uncheck: { uri: 'uncheck' },
  check: { uri: 'check' },
  check2: { uri: 'check_icon3' },
  edit: { uri: 'edit' },

  // slider
  sliderImageOne: { uri: 'slider_image_one' },
  sliderImageTwo: { uri: 'slider_image_two' },
  sliderImageThree: { uri: 'slider_image_three' },
  onboardingScreen: { uri: 'onboarding_screen' },
  bgHeader: { uri: 'bg_header' },
  rectangleBtn: { uri: 'rectangle_btn' },

  // Nav Icon
  contacts: { uri: 'contacts' },
  settings: { uri: 'settings' },
  notes: { uri: 'notes' },
  lock: { uri: 'lock' },
  help: { uri: 'help' },
  bell: { uri: 'bell' },

  uncheckIcon: { uri: 'uncheck_icon' },
  checkIcon: { uri: 'check_icon' },
  uncheckIcon2: { uri: 'uncheck_icon2' },
  checkIcon2: { uri: 'check_icon2' },
  addTask: { uri: 'add_task' },
  addPoll: { uri: 'polls_icon' },
  calendarIcon: { uri: 'calendar_icon' },
  calendar_icon2: { uri: 'calendar_icon2' },
  dashIcon: { uri: 'dash_icon' },
  clockIcon: { uri: 'clock_icon' },
  usersGroup: { uri: 'users_group' },
  subtask: { uri: 'subtask' },
  plusIcon: { uri: 'plus_icon' },
  plusThin: { uri: 'plus_thin' },
  closeIconBorder: { uri: 'close_icon_border' },
  downArrow: { uri: 'down_arrow' },
  upArrow: { uri: 'up_arrow' },
  checkMark: { uri: 'check-mark' },
  deleteIcon: { uri: 'delete_icon' },
  leftReply: { uri: 'left_reply' },
  rightReply: { uri: 'right_reply' },

  prevArrow: { uri: 'prev_arrow' },
  nextArrow: { uri: 'next_arrow' },
  addEvent: { uri: 'add_event' },
  eventImage: { uri: 'event_image' },
  star: { uri: 'star' },
  photo: { uri: 'photo' },
  mapPin: { uri: 'map_pin' },
  bellIcon: { uri: 'bell_icon' },
  closeIcon: { uri: 'close_icon' },
  x_icon: { uri: 'x_icon' },
  bars_gray: { uri: 'bars_gray' },

  pinIcon: { uri: 'pin' },
  deleteNewIcon: { uri: 'trash' },

  CIRCLE_GROUP: { uri: 'image_shape' },
  MSG_IMG: { uri: 'msg_dummy' },
  PVT_CHAT: { uri: 'private_chat' },
  mini: { uri: 'mini' },
  muute: { uri: 'mute' },
  replay_line: { uri: 'replay_line' },
  sort_icon: { uri: 'app_icon_gray' },
  gradient_layer: { uri: 'gradient_layer' },
  block: { uri: 'block_user' },
  notification: { uri: 'notification' },
  private_Icon: { uri: 'private_lock' },
  like: { uri: 'heart' },
  theme_Icon: {
    uri: 'night_mode',
  },
  chat_like: {
    uri: 'like',
  },
  copy: {
    uri: 'copy',
  },
  replyLeft: {
    uri: 'reply_left',
  },
  replyRight: {
    uri: 'reply_right',
  },
  report: {
    uri: 'report',
  },
  shortAppLogo: { uri: 'short_app_logo' },
  newArrow: { uri: 'new_arrow' },
  directInbox: {
    uri: 'direct_inbox',
  },
  iconAddCircle: {
    uri: 'icon_addcircle',
  },
  calAddIcon: {
    uri: 'calendar_float',
  },
  undrawMyNotifications: {
    uri: 'undraw_my_notifications',
  },
  add_moderator: {
    uri: 'add_moderator',
  },
  add_task_event: {
    uri: 'add_task_event',
  },
  event_icon: {
    uri: 'event_icon',
  },
  icon_calendar_add: {
    uri: 'icon_calendar_add',
  },
  icon_circle_check: {
    uri: 'icon_circle_check',
  },
  notification_list_img: {
    uri: 'notification_list_img',
  },
  notification_profile_dp: {
    uri: 'notification_profile_dp',
  },
  chat_name_icon: {
    uri: 'chat_name_icon',
  },
  new_sidenote: {
    uri: "new_sidenote",
  },
  new_sidenote2: {
    uri: "new_sidenote2",
  },
  new_task: {
    uri: "new_task",
  },
  task_icon2: {
    uri: "task_icon2",
  },
  connection: {
    uri: "connection",
  },
  direct_message: {
    uri: "direct_message"
  },
  link_icon: {
    uri: "link_icon"
  },
  link_circle_icon: {
    uri: "link_circle_icon"
  },
  calendar_pen_icon: {
    uri: "calendar_pen_icon"
  },
  notes_icon: {
    uri: "notes_icon"
  },
  direct_msg_icon: {
    uri: "direct_msg_icon"
  },
  globe_color_icon: {
    uri: "globe_color_icon"
  },
  categories_icon: {
    uri: "categories_icon"
  },
  upload_img_placeholder: {
    uri: "upload_img_placeholder"
  },
  chat_icon: {
    uri: "chat_icon"
  },
  add_task_icon: {
    uri: "add_task_icon"
  },
  send_icon: {
    uri: "send_icon"
  },
  disconnect_icon: {
    uri: "disconnect_icon"
  },
  calendar_no_data: {
    uri: "calendar_no_data"
  },
  insert_link_icon: {
    uri: "insert_link_icon"
  },
}
