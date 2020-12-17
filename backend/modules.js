module.exports.init = function (app, db) {
  let forum = require("./js/forum");
  forum.TambahForum(app, db);
  forum.ListForum(app, db);
  forum.HapusForum(app, db);
  forum.MetaDataForum(app, db);
  forum.EditForum(app, db);
  forum.img_forum(app, db);

  let pesan = require("./js/pesan")
  pesan.ListPesan(app, db);
  pesan.TambahPesan(app, db);
  pesan.HapusPesan(app, db);
  pesan.MetaDataPesan(app, db);
  pesan.EditPesan(app, db);
  pesan.img_pesan(app, db);

  let user = require("./js/user")
  user.Check(app, db);
  user.Get(app, db);
  user.Login(app, db);
  user.PP_Change(app, db);
  user.Register(app, db);
  user.PP_Delete(app, db);
  user.Change(app, db);

  let compiler = require("./js/compiler")
  compiler.Compile(app, db);
  compiler.iFrame(app, db);

  let search = require("./js/search")
  search.search(app,db)
};