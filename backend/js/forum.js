const MongoClient = require('mongodb');
const formidable = require("formidable")

module.exports = {

    TambahForum: async function (app, db) {
        app.post("/api/forum/tambah", async (req, res) => {
            var id = await db.collection("forum").find({}).toArray();
            id = Math.round(new Date().getTime() + id.length);
            db.collection("forum").insertOne({
                idForum: id,
                namaForum: req.body.arr[0],
                idOP: req.body.arr[1],
                pesanUtama: req.body.arr[2],
                lastEdited: null
            });
            return res.json({
                id: id,
            });
        });
    },

    ListForum: async function (app, db) {
        app.get("/api/forum/list", async (req, res) => {
            const docs = await db.collection("forum").find({}).toArray();
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
        });
    },

    HapusForum: async function (app, db) {
        app.post("/api/forum/hapus", async (req, res) => {
            var id = req.body.idForum;
            await db
                .collection("forum")
                .deleteOne({
                    idForum: id,
                });
            await db
                .collection("pesan")
                .deleteMany({
                    idForum: id,
                });
            res.status(200).send();
        });
    },

    MetaDataForum: async function (app, db) {
        app.post("/api/forum/metadata", async (req, res) => {
            var id = parseInt(req.body.arr[0]);
            const docs = await db
                .collection("forum")
                .find({
                    idForum: id,
                }).toArray()

            if (docs.length < 1) return res.status(404).send();
            let getUser;
            getUser = await db.collection("user").find({ "user_id": docs[0].idOP }).toArray();
            docs[0]["ProfilePicture"] = getUser[0].profile_picture;
            docs[0]["originalPoster"] = getUser[0].nama;

            res.json(docs);

        });
    },

    EditForum: async function (app, db) {
        app.post("/api/forum/edit", async (req, res) => {
            var id = parseInt(req.body.arr[0])
            var crnDate = new Date().getTime()
            db.collection("forum").update({ idForum: id }, {
                idForum: id,
                namaForum: req.body.arr[1],
                idOP: req.body.arr[2],
                pesanUtama: req.body.arr[3],
                lastEdited: crnDate
            })
            res.status(200).send();
        });
    },

    img_forum: async function (app, db) {
        app.post("/api/forum/img_forum", async (req, res) => {

            var form = new formidable.IncomingForm();
            form.parse(req);
            let uploaded = []

            form
                .on('fileBegin', function (name, file) {
                    file.name = `${new Date().getTime()}.${file.name.split('.').pop().toLowerCase()}`
                    file.path = `./image/forum/${file.name}`;
                })
                .on('file', function (name, file) { uploaded.push(`${req.protocol}://${req.get('host')}/image/forum/${file.name}`) })
                .on('aborted', () => { return res.send("Fail") })
                .on("error", (err) => { return res.send(`Fail; Err: ${err}`) })
                .on("end", () => { !uploaded.length ? res.send("Fail") : res.send(uploaded[0]) })
        });
    }


}