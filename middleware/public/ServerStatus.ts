const OK: Number = 200;

const SERVICE_UNAVAILABLE: Number = 503; 

interface ServerStatus {
  name: String,
  date: Number,
  code: Number
};

export {
  ServerStatus,
  OK,
  SERVICE_UNAVAILABLE,
};
