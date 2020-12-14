const md5 = require("md5")
const fs = require("fs")
var formidable = require('formidable');

module.exports = {
    Register: async function (app, db) {
        app.post("/api/user/register", async (req, res) => {

            var body = req.body, email = body.email.toLowerCase(), username = body.username.toLowerCase();
            let docs = await db.collection("user").find({ email: email }).toArray()
            if (docs.length) return res.json({ success: false, reason: "email" })
            docs = await db.collection("user").find({ username: username }).toArray()
            if (docs.length) return res.json({ success: false, reason: "username" })


            var id = await db.collection("user").find({}).toArray();
            id = (id.length * new Date().getTime()).toString();
            db.collection("user" /* BUKAN USERS TAPI USER */).insertOne({
                user_id: id, // Primary && Unique key
                /**
                 * Level:
                 * 1 = user biasa
                 * 2 - 8 = user dengan kemampuan tertentu / privileged users
                 * 9 = moderator
                 * 10 = admin
                 */
                level: "1",
                email: email, // Unique key
                password: md5(body.password),
                profile_picture: `${req.protocol}://${req.get('host')}/image/users/default.png`,
                nama: email.toLowerCase().split("@").shift(),
                username: body.username, // Unique key
                profesi: "",
                no_hp: "",
                alamat: "",
                /**
                 * Jenis kelamin:
                 * P = perempuan
                 * L = laki-laki
                 */
                jenis_kelamin: "L"
            });
            res.json({ success: true, id: id })
        })
    },

    Login: async function (app, db) { //plan: can login with either email or username
        app.post("/api/user/login", async (req, res) => {
            var email = req.body.email, password = md5(req.body.password);
            const docs = await db.collection("user").find({ email: email }).toArray()

            if (!docs.length) return res.json({ success: false, reason: 404 })
            else if (docs[0].password != password) return res.json({ success: false, reason: 401 })
            else res.json({ success: true, id: docs[0].user_id })
        })
    },

    Check: async function (app, db) {
        app.post("/api/user/check", async (req, res) => { //check existential
            var body = req.body, email = body.email.toLowerCase(), username = body.username.toLowerCase();
            let docs = await db.collection("user").find({ email: email }).toArray()
            if (docs.length) return res.json({ found: true, reason: "email" })
            docs = await db.collection("user").find({ username: username }).toArray()
            if (docs.length) return res.json({ found: true, reason: "username" })
            res.json({ found: false})
        })
    },

    Get: async function (app, db) {
        app.post("/api/user/get", async (req, res) => { //check details
            var uid = req.body.id
            const docs = await db.collection("user").find({ user_id: uid }).toArray()
            if (!docs[0]) return res.json({ found: false })
            var result = Object.assign({ found: true }, docs[0])
            delete result._id; delete result.password;
            res.json(result)

        })
    },

    Change: async function (app, db) {
        app.post("/api/user/change", async (req, res) => { //check details
            
            var uid = req.body.id, details = req.body.details
            let docs = await db.collection("user").find({ username: req.body.details.username }).toArray()
            if (docs.length) return res.json({ success: false, reason: "username" })
            db.collection("user").updateOne({ user_id: uid }, {
                $set: {
                    nama: details.nama,
                    username: details.username,
                    profesi: details.profesi,
                    no_hp: details.no_hp,
                    alamat: details.alamat,
                    jenis_kelamin: details.jenis_kelamin
                }
            })
            res.json({ success: true })
        })
    },

    PP_Change: async function (app, db) {
        app.post("/api/user/picture_up/:id", async (req, res) => {
            var uid = req.params.id;
            if (!uid) return res.sendStatus(403);
            var form = new formidable.IncomingForm();
            form.parse(req);
            let uploaded = []

            form
                .on('fileBegin', function (name, file) {
                    file.name = `${uid}.${file.name.split('.').pop().toLowerCase()}`
                    file.path = `./image/users/${file.name}`;
                })
                .on('file', function (name, file) { uploaded.push(`${req.protocol}://${req.get('host')}/image/users/${file.name}`) })
                .on('aborted', () => { return res.send("Fail") })
                .on("error", (err) => { return res.send(`Fail; Err: ${err}`) })
                .on("end", () => {
                    !uploaded.length ? res.json({ result: "Fail" }) : res.json({ result: uploaded[0] });
                    db.collection("user").updateOne({ user_id: uid }, { $set: { profile_picture: uploaded[0] } })
                })
        })
    },

    PP_Delete: async function (app, db) {
        app.post("/api/user/picture_delete", async (req, res) => {
            var uid = req.body.id;

            const docs = await db.collection("user").find({ user_id: uid }).toArray()
            var path = "./image/users/" + docs[0].profile_picture.split('/').pop()
            fs.unlink(path, (err) => {
                if (err) return res.json({ result: "Fail" })
                db.collection("user").updateOne({ user_id: uid }, { $set: { profile_picture: `${req.protocol}://${req.get('host')}/image/users/default.png` } })
                res.json({ result: `${req.protocol}://${req.get('host')}/image/users/default.png` })
                //file removed
            })
        })
    }
}