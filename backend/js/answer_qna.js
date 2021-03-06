const MongoClient = require('mongodb');
var formidable = require('formidable');

module.exports = {
    ListAnswer: async function (app, db) {
        app.post("/api/qna/answer/list", async (req, res) => {
            var id = parseInt(req.body.arr[0]);
            const docs = await db
                .collection("answer")
                .find({
                    idQnA: id,
                })
                .toArray();
            let getUser;

            for (let i = 0; i < docs.length; i++) {
                getUser = await db.collection("user").find({ "user_id": docs[i].idOP }).toArray();
                docs[i]["ProfilePicture"] = getUser[0].profile_picture;
                docs[i]["originalPoster"] = getUser[0].username;

                if(docs[i].ban.status){
                    let getBanner, banner_id = docs[i].ban.banner;
                    docs[i].ban.banner = {}
                    getBanner = await db.collection("user").find({ "user_id": banner_id }).toArray();
                    docs[i].ban.banner["originalPoster"] = getBanner[0].username;
                }
            }
            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            res.json(docs);
        });
    },


    TambahAnswer: async function (app, db) {
        app.post("/api/qna/answer/tambahanswer", async (req, res) => {
            var id = parseInt(req.body.arr[0])
            var answer = await db.collection("answer").find({ "idOP": req.body.arr[2], idQnA: id }).toArray()
            if (answer.length) return res.status(403).send()
            var idp = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));
            db.collection("answer").insertOne({
                idQnA: id,
                idAnswer: idp,
                createdDate: new Date().getTime(),
                isiAnswer: req.body.arr[1],
                idOP: req.body.arr[2],
                vote: {
                    score: 0,
                    list: {}
                },
                lastEdited: null,
                edittedBy: 0,
                ban: {
                    status: false,
                    ban_Date: null,
                    reason: null,
                    banner: null
                }
            });
            res.status(200).send();
        });
    },

    HapusAnswer: async function (app, db) {
        app.post("/api/answer/hapus", async (req, res) => {
            var id = req.body.idAnswer;
            const docs = await db
                .collection("answer")
                .deleteOne({
                    idAnswer: id,
                });
            res.status(200).send();
        });
    },

    MetaDataAnswer: async function (app, db) {
        app.post("/api/answer/metadata", async (req, res) => {
            var id = parseInt(req.body.idAnswer);
            const docs = await db
                .collection("answer")
                .find({
                    idAnswer: id,
                }).toArray()
            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            let getUser;
            getUser = await db.collection("user").find({ "user_id": docs[0].idOP }).toArray();
            docs[0]["ProfilePicture"] = getUser[0].profile_picture;
            docs[0]["originalPoster"] = getUser[0].username;
            res.json(docs);
        });
    },

    EditAnswer: async function (app, db) {
        app.post("/api/answer/edit", async (req, res) => {
            var crnDate = new Date().getTime()
            db.collection("answer").update({ idAnswer: req.body.arr[1] }, {
                $set: {
                    lastEdited: crnDate,
                    edittedBy: req.body.arr[4],
                    isiAnswer: req.body.arr[2]
                }
            })
            res.status(200).send();
        });
    },


    img_answer: async function (app, db) {
        app.post("/api/qna/img_answer", async (req, res) => {

            var form = new formidable.IncomingForm();
            form.parse(req);
            let uploaded = []

            form
                .on('fileBegin', function (name, file) {
                    file.name = `${new Date().getTime()}.${file.name.split('.').pop().toLowerCase()}`
                    file.path = `./image/answer/${file.name}`;
                })
                .on('file', function (name, file) { uploaded.push(`${req.protocol}://${req.get('host')}/image/answer/${file.name}`) })
                .on('aborted', () => { return res.send("Fail") })
                .on("error", (err) => { return res.send(`Fail; Err: ${err}`) })
                .on("end", () => { !uploaded.length ? res.send("Fail") : res.send(uploaded[0]) })
        });
    },

    vote_answer: async function (app, db) {
        app.post("/api/qna/answer/vote", async (req, res) => {
            var idAnswer = req.body.idAnswer
                , idUser = req.body.idUser
                , vote = req.body.vote
                , answer = await db.collection("answer").find({ "idAnswer": idAnswer }).project({ vote: 1, _id: 0 }).toArray()


            answer[0].vote.list[idUser] = { up: vote }


            let score = 0;
            for (const vote in answer[0].vote.list) {
                if (answer[0].vote.list[vote].up) score++
                else score--
            } answer[0].vote.score = score;

            await db.collection("answer").updateOne({ "idAnswer": idAnswer }, {
                $set: {
                    vote: answer[0].vote
                }
            })


            res.status(200).send()


        });
    },

    unvote_answer: async function (app, db) {
        app.post("/api/qna/answer/unvote", async (req, res) => {
            var idAnswer = req.body.idAnswer
                , idUser = req.body.idUser
                , answer = await db.collection("answer").find({ "idAnswer": idAnswer }).project({ vote: 1, _id: 0 }).toArray()

            if (!(idUser in answer[0].vote.list)) return res.status(403).send()

            delete answer[0].vote.list[idUser]


            let score = 0;
            for (const vote in answer[0].vote.list) {
                if (answer[0].vote.list[vote].up) score++
                else score--
            } answer[0].vote.score = score;


            await db.collection("answer").updateOne({ "idAnswer": idAnswer }, {
                $set: {
                    vote: answer[0].vote
                }
            })

            res.status(200).send()


        });
    }
}