module.exports = function (app, db) {
  let forum = require("./js/forum");
  forum.TambahForum(app, db);
  forum.ListForum(app, db);
  forum.HapusForum(app, db);
  forum.MetaDataForum(app, db);
  forum.EditForum(app, db);
  forum.img_forum(app, db);
  forum.LikeForum(app, db)

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
  search.search(app, db)

  let qna = require("./js/qna")
  qna.EditQnA(app, db)
  qna.HapusQnA(app, db)
  qna.ListQnA(app, db)
  qna.MetaDataQnA(app, db)
  qna.TambahQnA(app, db)
  qna.img_qna(app, db)
  qna.ResolveQnA(app, db)
  qna.LikeQnA(app, db)

  let answer = require("./js/answer_qna")
  answer.EditAnswer(app, db)
  answer.HapusAnswer(app, db)
  answer.ListAnswer(app, db)
  answer.MetaDataAnswer(app, db)
  answer.TambahAnswer(app, db)
  answer.img_answer(app, db)
  answer.vote_answer(app, db)
  answer.unvote_answer(app, db)

  let answer_comment = require("./js/answer_qna_comment")
  answer_comment.ListComment(app, db)
  answer_comment.TambahComment(app, db)

  let tags = require("./js/tag")
  tags.ListTags(app, db)

  let home = require("./js/home")
  home.Statistic(app, db)

  let admin = require("./js/admin")
  admin.levelCheck(app, db)
  admin.BanForum(app, db)
  admin.BanPesan(app, db)
  admin.BanAnswer(app, db)
  admin.BanQnA(app, db)
  admin.Report(app, db)
  admin.ReportList(app, db)
  admin.ReportClose(app, db)
  admin.AddTag(app, db)
  admin.EditTag(app, db)
  admin.DeleteTag(app,db)
};