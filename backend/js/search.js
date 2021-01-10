module.exports = {
    search: async function (app, db) {
        app.post("/api/search", async (req, res) => {
            var keys = req.body.keywords;
            var type = req.body.types;
            var tag = req.body.tags
            var tags = [];
            var docs = {}

            //list all user
            var _users = await db.collection("user").find({ username: new RegExp(keys, "i") }).toArray(), id = [], projection = { _id: 0 };
            for (let i = 0; i < _users.length; i++)  id.push(_users[i].user_id);

            //get all inserted tags id
            if (tag.length) {

                for (let i = 0; i < tag.length; i++) {
                    var temp = await db.collection("tags").find({ value: new RegExp(tag[i], "i") }).toArray()
                    console.log(tag[i]);
                    tags.push(temp[0].idTag)
                }

            }



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
                else {
                    queries.push({ nama: new RegExp(keys, "i") })
                    queries.push({ username: new RegExp(keys, "i") })
                    projection["email"] = 0
                    projection["password"] = 0
                    projection["user_id"] = 0
                }

                var query;

                if (tags.length) {
                    if (type[i] == "forum" || type[i] == "qna") query = { tags: { $all: tags }, $or: queries }
                    else query = { $or: queries }
                }
                else query = { $or: queries }

                docs[type[i]] = await db.collection(type[i]).find(query).project(projection).toArray()

                if (docs[type[i]].length) {
                    if (type[i] == "forum" || type[i] == "qna") {
                        for (let f = 0; f < docs[type[i]].length; f++) {

                            var result = docs[type[i]][f]
                            let getUser;
                            getUser = await db.collection("user").find({ "user_id": result.idOP }).toArray();
                            result["ProfilePicture"] = getUser[0].profile_picture;
                            result["originalPoster"] = getUser[0].username;

                            result["tagList"] = []
                            for (let t = 0; t < result.tags.length; t++) {

                                let tag = await db.collection("tags").find({ "idTag": result.tags[t] }).project({ "value": 1, "tagDescription": 1, "idTag": 1 }).toArray()
                                result["tagList"].push(tag[0])

                            }

                        }
                    }
                }


            }

            console.log(docs);

            res.send(docs)
        });
    }
}