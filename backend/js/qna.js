const MongoClient = require('mongodb');
const formidable = require("formidable")

module.exports = {

    TambahQnA: async function (app, db) {
        app.post("/api/qna/tambah", async (req, res) => {
            var id = await db.collection("qna").find({}).toArray();
            id = Math.round(new Date().getTime() + id.length);
            db.collection("qna").insertOne({
                idQnA: id,
                namaQnA: req.body.arr[0],
                idOP: req.body.arr[1],
                pesanUtama: req.body.arr[2],
                viewed: [],
                liked: [],
                vote: {
                    score: 0,
                    list: {}
                },
                resolve_answer: 0,
                resolved_date: 0,
                lastEdited: null
            });
            return res.json({
                id: id,
            });
        });
    },

    ListQnA: async function (app, db) {
        app.get("/api/qna/list", async (req, res) => {
            const docs = await db.collection("qna").find({}).toArray();
            let getUser, getResponses;

            for (let i = 0; i < docs.length; i++) {
                0
                getUser = await db.collection("user").find({ "user_id": docs[i].idOP }).toArray();
                docs[i]["ProfilePicture"] = getUser[0].profile_picture;
                docs[i]["originalPoster"] = getUser[0].username;

                getResponses = await db.collection("answer").find({ "idQnA": docs[i].idQnA }).toArray();
                docs[i]["responses"] = getResponses.length;
            }

            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            res.json(docs);
        });
    },

    HapusQnA: async function (app, db) {
        app.post("/api/qna/hapus", async (req, res) => {
            var id = req.body.idQnA;
            await db
                .collection("qna")
                .deleteOne({
                    idQnA: id,
                });
            await db
                .collection("answer")
                .deleteMany({
                    idQnA: id,
                });
            res.status(200).send();
        });
    },

    MetaDataQnA: async function (app, db) {
        app.post("/api/qna/metadata", async (req, res) => {
            var id = parseInt(req.body.arr[0]);
            const docs = await db
                .collection("qna")
                .find({
                    idQnA: id,
                }).toArray()

            if (docs.length < 1) return res.status(404).send();

            var viewer = req.body.arr[1]
            if (!viewer) viewer = req.socket.remoteAddress.replace(/^.*:/, '');

            if (!docs[0].viewed.includes(viewer)) {
                docs[0].viewed.push(viewer)

                await db.collection("qna").update({ "idQnA": id, }, {
                    $set: { viewed: docs[0].viewed }
                })
            }

            let getUser;
            getUser = await db.collection("user").find({ "user_id": docs[0].idOP }).toArray();
            docs[0]["ProfilePicture"] = getUser[0].profile_picture;
            docs[0]["originalPoster"] = getUser[0].username;

            let getResponses;
            getResponses = await db.collection("answer").find({ "idQnA": docs[0].idQnA }).toArray();
            docs[0]["responses"] = getResponses.length;

            res.json(docs);

        });
    },

    EditQnA: async function (app, db) {
        app.post("/api/qna/edit", async (req, res) => {
            var id = parseInt(req.body.arr[0])
            var crnDate = new Date().getTime()
            db.collection("qna").update({ idQnA: id }, {
                idQnA: id,
                namaQnA: req.body.arr[1],
                idOP: req.body.arr[2],
                pesanUtama: req.body.arr[3],
                lastEdited: crnDate
            })
            res.status(200).send();
        });
    },

    img_qna: async function (app, db) {
        app.post("/api/qna/img_qna", async (req, res) => {

            var form = new formidable.IncomingForm();
            form.parse(req);
            let uploaded = []

            form
                .on('fileBegin', function (name, file) {
                    file.name = `${new Date().getTime()}.${file.name.split('.').pop().toLowerCase()}`
                    file.path = `./image/qna/${file.name}`;
                })
                .on('file', function (name, file) { uploaded.push(`${req.protocol}://${req.get('host')}/image/qna/${file.name}`) })
                .on('aborted', () => { return res.send("Fail") })
                .on("error", (err) => { return res.send(`Fail; Err: ${err}`) })
                .on("end", () => { !uploaded.length ? res.send("Fail") : res.send(uploaded[0]) })
        });
    },

    ResolveQnA: async function (app, db) {
        app.post("/api/qna/resolve", async (req, res) => {

            var id = parseInt(req.body.idQnA), user_id = req.body.user_id, idAnswer = req.body.idAnswer;

            var crnDate = new Date().getTime()

            let qna_metadata = await db.collection("qna").find({ "idQnA": id }).toArray()

            if (qna_metadata[0].resolve_answer) return res.status(403).send() // sudah terjawab
            if (qna_metadata[0].idOP != user_id) return res.status(403).send() // bukan penanya

            db.collection("qna").update({ "idQnA": id }, {
                $set: {
                    resolve_answer: idAnswer,
                    resolved_date: crnDate
                }
            })
            res.status(200).send();
        });
    },

    LikeQnA: async function (app, db) {

        app.post("/api/qna/like", async (req, res) => {

            var id = parseInt(req.body.arr[0]);
            var docs = await db
                .collection("qna")
                .find({
                    idQnA: id,
                }).toArray()

            if (!docs.length) return res.status(403).send();

            var viewer = req.body.arr[1]
            if (!viewer) return res.status(403).send(); // wajib login untuk like

            if (!docs[0].liked.includes(viewer)) docs[0].liked.push(viewer) // like jika tidak ada
            else docs[0].liked.remove(viewer)  // unlike jika ada

            await db.collection("qna").update({ "idQnA": id, }, {
                $set: { liked: docs[0].liked }
            })

            res.status(200).send()

        });

    }
}