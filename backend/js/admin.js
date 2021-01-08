module.exports = {

    levelCheck: async function (app, db) {
        app.post("/api/admin/check", async (req, res) => {
            var uid = req.body.id, isAdmin = false;
            const docs = await db.collection("user").find({ user_id: uid }).toArray()
            if (!docs[0]) return res.json({ found: false })

            if (parseInt(docs[0].level) > 90) isAdmin = true;

            res.json({ found: true, isAdmin: isAdmin, level: docs[0].level })
        })
    },

    BanForum: async function (app, db) {
        app.post("/api/admin/ban/forum", async (req, res) => {

            var uid = req.body.uid, id = parseInt(req.body.id);
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var crnDate = new Date().getTime()
            db.collection("forum").update({ idForum: id }, {
                $set: {
                    ban: {
                        status: true,
                        ban_Date: crnDate,
                        reason: req.body.reason,
                        banner: uid
                    }
                }
            })

            res.status(200).send()
        })
    },

    BanPesan: async function (app, db) {
        app.post("/api/admin/ban/pesan", async (req, res) => {

            var uid = req.body.uid, id = parseInt(req.body.id);
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var crnDate = new Date().getTime()
            db.collection("pesan").update({ idPesan: id }, {
                $set: {
                    ban: {
                        status: true,
                        ban_Date: crnDate,
                        reason: req.body.reason,
                        banner: uid
                    }
                }
            })

            res.status(200).send()
        })
    },


    BanQnA: async function (app, db) {
        app.post("/api/admin/ban/qna", async (req, res) => {

            var uid = req.body.uid, id = parseInt(req.body.id);
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var crnDate = new Date().getTime()
            db.collection("qna").update({ idQnA: id }, {
                $set: {
                    ban: {
                        status: true,
                        ban_Date: crnDate,
                        reason: req.body.reason,
                        banner: uid
                    }
                }
            })

            res.status(200).send()
        })
    },

    BanAnswer: async function (app, db) {
        app.post("/api/admin/ban/answer", async (req, res) => {

            var uid = req.body.uid, id = parseInt(req.body.id);
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var crnDate = new Date().getTime()
            db.collection("answer").update({ idAnswer: id }, {
                $set: {
                    ban: {
                        status: true,
                        ban_Date: crnDate,
                        reason: req.body.reason,
                        banner: uid
                    }
                }
            })

            res.status(200).send()
        })
    },

    Report: async function (app, db) {
        app.post("/api/admin/report", async (req, res) => {

            var uid = req.body.uid, id = parseInt(req.body.id), type = req.body.type, reason = req.body.reason;
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            // if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var check = await db.collection("report").find({ type: type, reporter: uid, reported: id }).toArray()
            console.log(check);
            if (check.length && !check[0].status.handled) {
                db.collection("report").update({ type: type, reporter: uid, reported: id }, {
                    $set: {
                        judul: reason.title,
                        describe: reason.describe,
                        lastReport: new Date().getTime()
                    }
                })
            }
            else {
                var reportId = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));
                db.collection("report").insertOne({
                    reportId: reportId,
                    lastReport: new Date().getTime(),
                    reporter: uid,
                    reported: id,
                    type: type,
                    judul: reason.title,
                    describe: reason.describe,
                    status: {
                        handled: false,
                        handler: null,
                        handle_date: null,
                        response: null
                    }
                });
            }

            res.status(200).send()
        })
    },

    ReportList: async function (app, db) {
        app.post("/api/admin/report/list", async (req, res) => {
            var uid = req.body.uid;
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var reports = await db.collection("report").find({}).toArray();

            let getUser, getReported, getOP;
            for (let i = 0; i < reports.length; i++) {

                getUser = await db.collection("user").find({ user_id: reports[i].reporter }).toArray()
                reports[i].reporter = {
                    username: getUser[0].username,
                    profile_picture: getUser[0].profile_picture
                }



                switch (reports[i].type) {
                    case "qna": getReported = await db.collection("qna").find({ idQnA: reports[i].reported }).toArray(); break;
                    case "forum": getReported = await db.collection("forum").find({ idForum: reports[i].reported }).toArray(); break;
                    case "answer": getReported = await db.collection("answer").find({ idAnswer: reports[i].reported }).toArray(); break;
                    case "pesan": getReported = await db.collection("pesan").find({ idPesan: reports[i].reported }).toArray(); break;
                }

                getOP = await db.collection("user").find({ "user_id": getReported[0].idOP }).toArray();
                reports[i].reported = {
                    id: reports[i].reported,
                    metadata: getReported[0],
                    OP: {
                        profile_picture: getOP[0].profile_picture,
                        username: getOP[0].username
                    }
                }

                if (reports[i].status.handled) {
                    getHandler = await db.collection("user").find({ "user_id": reports[i].status.handler }).toArray();
                    reports[i].status.handler = {
                        id: reports[i].status.handler,
                        username: getHandler[0].username,
                        profile_picture: getHandler[0].profile_picture
                    }
                }


            }
            res.json({ reports })

        })

    },

    ReportClose: async function (app, db) {
        app.post("/api/admin/report/close", async (req, res) => {
            var idReport = parseInt(req.body.idReport), response = req.body.response, uid = req.body.uid
            console.log(req.body);
            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var crnDate = new Date().getTime()
            db.collection("report").update({ reportId: idReport }, {
                $set: {
                    status: {
                        handled: true,
                        handle_date: crnDate,
                        response: response,
                        handler: uid
                    }
                }
            })

            res.status(200).send()
        })
    },

    AddTag: async function (app, db) {
        app.post("/api/admin/tag/add", async (req, res) => {

            var uid = req.body.uid, value = req.body.name, tagDescription = req.body.description

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            var idt = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));

            db.collection("tags").insertOne({
                idTag: idt,
                value: value,
                tagDescription: tagDescription
            });
            res.status(200).send();
        });
    },

    EditTag: async function (app, db) {
        app.post("/api/admin/tag/edit", async (req, res) => {

            var uid = req.body.uid, idTag = req.body.idTag, value = req.body.name, tagDescription = req.body.description

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")


            db.collection("tags").update({ idTag: idTag }, {
                $set: {
                    value: value,
                    tagDescription: tagDescription
                }
            });
            res.status(200).send();
        });
    },

    DeleteTag: async function (app, db) {
        app.post("/api/admin/tag/delete", async (req, res) => {

            var uid = req.body.uid, idTag = req.body.idTag

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")


            db.collection("tags").deleteOne({ idTag: idTag });

            // edit forum & qna yang memiliki tag
            db.collection("forum").update({}, {
                $pull: {
                    tags: idTag
                }
            },
                { multi: true })

            db.collection("qna").update({}, {
                $pull: {
                    tags: idTag
                }
            },
                { multi: true })

            res.status(200).send();
        });
    },

    AdviceIn: async function (app, db) {
        app.post("/api/advice/in", async (req, res) => {
            var uid = req.body.uid, about = req.body.about, describe = req.body.describe

            var ida = Math.round(new Date().getTime() % Math.random() * (Math.random() * 10000000));

            db.collection("advice").insertOne({
                idAdv: ida,
                time: new Date().getTime(),
                from: uid,
                about: about,
                describe: describe,
                considered: false,
                accepted: false,
                readBy: []
            });
            res.status(200).send();
        })
    },

    AdviceList: async function (app, db) {

        app.post("/api/admin/advice/list", async (req, res) => {

            var uid = req.body.uid

            const doc = await db.collection("user").find({ user_id: uid }).toArray()

            if (!doc[0]) return res.status(403).send("Unauthorized")
            if (parseInt(doc[0].level) < 90) return res.status(403).send("Unauthorized")

            var docs = await db
                .collection("advice")
                .find({})
                .project({ "_id": 0 })
                .toArray();

            let getOP;

            for (let i = 0; i < docs.length; i++) {

                getOP = await db.collection("user").find({ "user_id": docs[i].from }).toArray();
                docs[i].from = {
                    id: docs[i].from,
                    username: getOP[0].username,
                    profile_picture: getOP[0].profile_picture
                }


                if (docs[i].considered) {
                    getOP = await db.collection("user").find({ "user_id": docs[i].considered.by }).toArray();
                    docs[i].considered = {
                        by: {
                            username: getOP[0].username,
                            profile_picture: getOP[0].profile_picture
                        },
                        date: docs[i].considered.date
                    }
                }

                if (docs[i].accepted) {
                    getOP = await db.collection("user").find({ "user_id": docs[i].accepted.by }).toArray();
                    docs[i].accepted = {
                        by: {
                            username: getOP[0].username,
                            profile_picture: getOP[0].profile_picture
                        },
                        date: docs[i].accepted.date
                    }
                }

            }

            res.json(docs);

        });

    },

    AdviceDeleteAll: async function (app, db) {

        app.post("/api/admin/advice/delete_all", async (req, res) => {
            var uid = req.body.uid, idd = req.body.idd

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            db.collection("advice").deleteMany({ from: idd, considered: false })


            res.status(200).send();
        })
    },

    AdviceMarkRead: async function (app, db) {

        app.post("/api/admin/advice/read", async (req, res) => {
            var uid = req.body.uid, idAdv = req.body.idAdv

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            db.collection("advice").updateOne({ idAdv: idAdv }, {
                $push: { readBy: uid }
            })


            res.status(200).send();
        })
    },

    AdviceConsider: async function (app, db) {

        app.post("/api/admin/advice/consider", async (req, res) => {
            var uid = req.body.uid, idAdv = req.body.idAdv

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            db.collection("advice").updateOne({ idAdv: idAdv }, {
                $set: {
                    considered: {
                        date: new Date().getTime(),
                        by: uid
                    }
                }
            })
            res.status(200).send();
        })
    },

    AdviceUnConsider: async function (app, db) {

        app.post("/api/admin/advice/unconsider", async (req, res) => {
            var uid = req.body.uid, idAdv = req.body.idAdv

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            db.collection("advice").updateOne({ idAdv: idAdv }, {
                $set: {
                    considered: false
                }
            })
            res.status(200).send();
        })
    },

    AdviceAccept: async function (app, db) {
        app.post("/api/admin/advice/accept", async (req, res) => {
            var uid = req.body.uid, idAdv = req.body.idAdv

            const docs = await db.collection("user").find({ user_id: uid }).toArray()

            if (!docs[0]) return res.status(403).send("Unauthorized")
            if (parseInt(docs[0].level) < 90) return res.status(403).send("Unauthorized")

            db.collection("advice").updateOne({ idAdv: idAdv }, {
                $set: {
                    accepted: {
                        date: new Date().getTime(),
                        by: uid
                    }
                }
            })
            res.status(200).send();
        })
    }
}