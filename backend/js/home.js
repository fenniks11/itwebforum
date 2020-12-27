module.exports = {
    Statistic: async function (app, db) {
        app.get("/api/statistic", async (req, res) => {

            total = {}

            let temp = await db.collection("user").find({}).toArray()
            total.user = temp.length

            temp = await db.collection("forum").find({}).toArray()
            total.forum = temp.length

            temp = await db.collection("pesan").find({}).toArray()
            total.pesan = temp.length


            temp = await db.collection("qna").find({}).toArray()
            total.pertanyaan = temp.length

            temp = await db.collection("tags").find({}).toArray()
            total.tags = temp.length

            temp = await db.collection("qna").find({ "resolve_answer": { $gt: 0 } }).toArray()
            total.pertanyaan_terjawab = temp.length

            
            res.send(total)
        });
    }
}