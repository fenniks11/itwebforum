module.exports = {
    search: async function (app, db) {
        app.post("/api/search", async (req, res) => {
            var keys = req.body.keywords;
            var type = req.body.types;
            var docs = {}

            //list all user
            var _users = await db.collection("user").find({ username: new RegExp(keys, "i") }).toArray(), id = [], projection = { _id: 0 };
            for (let i = 0; i < _users.length; i++)  id.push(_users[i].user_id);

            //list all tags
            var _tags = await db.collection("Tags").find({value: new RegExp(keys, "i")}).toArray()

            for (let i = 0; i < type.length; i++) {
                let queries = []
                if (type[i] == "forum") {
                    queries.push({ namaForum: new RegExp(keys, "i") })
                    queries.push({ pesanUtama: new RegExp(keys, "i") })
                    queries.push({ idOP: { $in: id } })
                }
                if (type[i] == "qna") {
                    queries.push({ namaQnA: new RegExp(keys, "i") })
                    queries.push({ pesanUtama: new RegExp(keys, "i") })
                    queries.push({ idOP: { $in: id } })
                }
                else if (type[i] == "pesan") {
                    queries.push({ isiPesan: new RegExp(keys, "i") })
                    queries.push({ pesanUtama: new RegExp(keys, "i") })
                    queries.push({ idOP: { $in: id } })
                }
                else {
                    queries.push({ nama: new RegExp(keys, "i") })
                    queries.push({ username: new RegExp(keys, "i") })
                    projection["email"] = 0
                    projection["password"] = 0
                    projection["user_id"] = 0
                }


                docs[type[i]] = await db.collection(type[i]).find(
                    { $or: queries }
                ).project(projection).toArray()

            }


            res.send(docs)
        });
    }
}