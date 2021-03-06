const MongoClient = require('mongodb');
const formidable = require("formidable")

module.exports = {

    TambahForum: async function (app, db) {
        app.post("/api/forum/tambah", async (req, res) => {
            var id  = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));
            db.collection("forum").insertOne({
                idForum: id,
                createdDate: new Date().getTime(),
                namaForum: req.body.arr[0],
                idOP: req.body.arr[1],
                pesanUtama: req.body.arr[2],
                tags: req.body.arr[3],
                viewed: [],
                liked: [],
                lastEdited: null,
                edittedBy: 0,
                ban: {
                    status: false,
                    ban_Date: null,
                    reason: null,
                    banner: null
                }
            });
            return res.json({
                id: id,
            });
        });
    },

    ListForum: async function (app, db) {
        app.get("/api/forum/list", async (req, res) => {
            const docs = await db.collection("forum").find({"ban.status": false}).toArray();
            let getUser, getResponses;

            for (let i = 0; i < docs.length; i++) {
                getUser = await db.collection("user").find({ "user_id": docs[i].idOP }).toArray();
                docs[i]["ProfilePicture"] = getUser[0].profile_picture;
                docs[i]["originalPoster"] = getUser[0].username;

                getResponses = await db.collection("pesan").find({ "idForum": docs[i].idForum }).toArray();
                docs[i]["responses"] = getResponses.length;

                docs[i]["tagList"] = []

                for (let t = 0; t < docs[i].tags.length; t++) {
                    let tag = await db.collection("tags").find({ "idTag": docs[i].tags[t] }).project({ "value": 1, "tagDescription": 1, "idTag": 1 }).toArray()
                    docs[i]["tagList"].push(tag[0])
                }
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
            var docs = await db
                .collection("forum")
                .find({
                    idForum: id,
                }).toArray()

            if (!docs.length) return res.status(403).send();


            var viewer = req.body.arr[1]
            if (!viewer) viewer = req.socket.remoteAddress.replace(/^.*:/, '');

            if (!docs[0].viewed.includes(viewer)) {
                docs[0].viewed.push(viewer)

                await db.collection("forum").update({ "idForum": id, }, {
                    $set: { viewed: docs[0].viewed }
                })
            }

            let getUser;
            getUser = await db.collection("user").find({ "user_id": docs[0].idOP }).toArray();
            docs[0]["ProfilePicture"] = getUser[0].profile_picture;
            docs[0]["originalPoster"] = getUser[0].username;

            let getResponses;
            getResponses = await db.collection("pesan").find({ "idForum": docs[0].idForum }).toArray();
            docs[0]["responses"] = getResponses.length;

            if(docs[0].ban.status){
                let getBanner, banner_id = docs[0].ban.banner;
                docs[0].ban.banner = {}
                getBanner = await db.collection("user").find({ "user_id": banner_id }).toArray();
                docs[0].ban.banner["ProfilePicture"] = getBanner[0].profile_picture;
                docs[0].ban.banner["originalPoster"] = getBanner[0].username;
            }


            res.json(docs);

        });
    },

    EditForum: async function (app, db) {
        app.post("/api/forum/edit", async (req, res) => {
            var id = parseInt(req.body.arr[0])
            var crnDate = new Date().getTime()
            db.collection("forum").update({ idForum: id }, {
                $set: {
                    lastEdited: crnDate,
                    edittedBy: req.body.arr[5],
                    pesanUtama: req.body.arr[3],
                    namaForum: req.body.arr[1],
                    tags: req.body.arr[4],
                }
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
    },

    LikeForum: async function (app, db) {

        app.post("/api/forum/like", async (req, res) => {

            var id = parseInt(req.body.arr[0]);
            var docs = await db
                .collection("forum")
                .find({
                    idForum: id,
                }).toArray()

            if (!docs.length) return res.status(403).send();


            var viewer = req.body.arr[1]
            if (!viewer) return res.status(403).send(); // wajib login untuk like

            if (!docs[0].liked.includes(viewer)) docs[0].liked.push(viewer)
            else docs[0].liked.remove(viewer)

            await db.collection("forum").update({ "idForum": id, }, {
                $set: { liked: docs[0].liked }
            })

            res.status(200).send()

        });

    }
}