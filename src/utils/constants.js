const NAVBAR_TABS = [
  { id: "inbox", label: "Inbox" },
  { id: "archived", label: "Archived" },
];

const TOASTER_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  SUCCESS: "Success!!",
};

const CALL_DIRECTION = {
    INBOUND: 'inbound',
    OUTBOUND: 'outbound',
};

const CALL_TYPES = {
    MISSED: 'missed',
    ANSWERED: 'answered',
    VOICEMAIL: 'voicemail',
};

const CALL_OUTCOME_MSSG = {
    MISSED: 'tried to call',
    ANSWERED: 'talked to',
    VOICEMAIL: 'left a voicemail for',
};

export { NAVBAR_TABS, TOASTER_MESSAGES, CALL_DIRECTION, CALL_TYPES, CALL_OUTCOME_MSSG };
