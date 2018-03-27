import crypto from "crypto";

const hash = (block) => {
  return crypto
    .createHash("sha256")
    .update(block)
    .digest("hex");
};

const getDate = timestamp => {
  let d = new Date(timestamp);
  let hrs = d.getHours();
  let mins = d.getMinutes();
  let days = d.getDay();
  let mnth = d.getMonth();
  let year = d.getFullYear();
  if (hrs < 10) hrs = "0" + hrs;
  if (mins < 10) mins = "0" + mins;
  if (days < 10) days = "0" + days;
  if (mnth < 10) mnth = "0" + mnth;
  return hrs + ":" + mins + " " + days + "." + mnth + "." + year;
};

module.exports = {
  hash,
  getDate
};
