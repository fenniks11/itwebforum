module.exports = {

    ListComment: async function (app, db) {
        app.post("/api/qna/answer/comment/list", async (req, res) => {
            var id = req.body.idAnswer;
            const docs = await db
                .collection("answer_comment")
                .find({
                    idAnswer: id,
                })
                .toArray();
            let getUser;

            for (let i = 0; i < docs.length; i++) {
                getUser = await db.collection("user").find({ "user_id": docs[i].idOP }).toArray();
                docs[i]["ProfilePicture"] = getUser[0].profile_picture;
                docs[i]["originalPoster"] = getUser[0].username;
            }
            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            res.json(docs);
        })
    },

    TambahComment: async function (app, db) {
        app.post("/api/qna/answer/comment/tambahcomment", async (req, res) => {
            var id = parseInt(req.body.arr[0])
            var idp = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));
            db.collection("answer_comment").insertOne({
                idAnswer: id,
                idComment: idp,
                createdDate: new Date().getTime(),
                isiComment: req.body.arr[1],
                idOP: req.body.arr[2],
                vote: {
                    score: 0,
                    list: {}
                },
                lastEdited: null
            });
            res.status(200).send();
        });
    },
}