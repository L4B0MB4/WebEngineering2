const readChunk = require("read-chunk");
const fileType = require("file-type");

async function checkFileType(file) {
  const buffer = readChunk.sync(file, 0, 4100);
  const fileinfo = await fileType(buffer);
  if (fileinfo.mime.startsWith("image")) return true;
  else return false;
}

function handleLogin(err, user, info, req, res) {
  if (err) {
    return res.json({ type: "error", message: "Fehler beim Login" });
  }
  if (!user) {
    return res.json({ type: "error", message: "Fehler beim Login" });
  }
  req.logIn(user, function(err) {
    if (err) {
      return res.json({ type: "error", message: "Fehler beim Login" });
    }
    return res.json({
      type: "success",
      message: "Erfolgreich eingeloggt"
    });
  });
}

function broadcastOrEmit(socket, type, data, socketcount) {
  if (socketcount < 2) {
    socket.emit(type, data);
  } else {
    socket.broadcast.emit(type, data);
  }
}

module.exports = {
  handleLogin,
  broadcastOrEmit,
  checkFileType
};
