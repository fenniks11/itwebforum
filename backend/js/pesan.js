const MongoClient = require('mongodb');
var formidable = require('formidable');

module.exports = {
    ListPesan: async function (app, db) {
        app.post("/api/forum/pesan/list", async (req, res) => {
            var id = parseInt(req.body.arr[0]);
            const docs = await db
                .collection("pesan")
                .find({
                    idForum: id,
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
        });
    },


    TambahPesan: async function (app, db) {
        app.post("/api/forum/pesan/tambahpesan", async (req, res) => {
            console.log(req.body);
            // return res.sendStatus(200)
            var id = parseInt(req.body.arr[0])
            var idp = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000))
            db.collection("pesan").insertOne({
                idForum: id,
                idPesan: idp,
                createdDate: new Date().getTime(),
                isiPesan: req.body.arr[1],
                idOP: req.body.arr[2],
                lastEdited: null
            });
            res.status(200).send();
        });
    },

    HapusPesan: async function (app, db) {
        app.post("/api/pesan/hapus", async (req, res) => {
            var id = req.body.idPesan;
            const docs = await db
                .collection("pesan")
                .deleteOne({
                    idPesan: id,
                });
            res.status(200).send();
        });
    },

    MetaDataPesan: async function (app, db) {
        app.post("/api/pesan/metadata", async (req, res) => {
            var id = parseInt(req.body.idPesan);
            const docs = await db
                .collection("pesan")
                .find({
                    idPesan: id,
                }).toArray()
            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            let getUser;
            getUser = await db.collection("user").find({ "user_id": docs[0].idOP }).toArray();
            docs[0]["originalPoster"] = getUser[0].nama;
            res.json(docs);
        });
    },

    EditPesan: async function (app, db) {
        app.post("/api/pesan/edit", async (req, res) => {
            var crnDate = new Date().getTime()
            db.collection("pesan").update({ idPesan: req.body.arr[1] }, {
                $set:{
                    isiPesan: req.body.arr[2],
                    lastEdited: crnDate    
                }
            })
            res.status(200).send();
        });
    },


    img_pesan: async function (app, db) {
        app.post("/api/forum/img_pesan", async (req, res) => {

            var form = new formidable.IncomingForm();
            form.parse(req);
            let uploaded = []

            form
                .on('fileBegin', function (name, file) {
                    file.name = `${new Date().getTime()}.${file.name.split('.').pop().toLowerCase()}`
                    file.path = `./image/pesan/${file.name}`;
                })
                .on('file', function (name, file) { uploaded.push(`${req.protocol}://${req.get('host')}/image/pesan/${file.name}`) })
                .on('aborted', () => { return res.send("Fail") })
                .on("error", (err) => { return res.send(`Fail; Err: ${err}`) })
                .on("end", () => { !uploaded.length ? res.send("Fail") : res.send(uploaded[0]) })
        });
    }
}