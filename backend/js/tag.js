module.exports = {
    ListTags: async function (app, db) {

        app.get("/api/tags/list", async (req, res) => {

            const docs = await db
                .collection("tags")
                .find({})
                .project({"_id": 0})
                .toArray();



            if (!docs)
                return res.json({
                    error: "Gagal mendapatkan list",
                });
            res.json(docs);

        });

    }
}