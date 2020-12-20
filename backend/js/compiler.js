const compiler = require("compile-run")
const php = "D:\\xampp\\php\\php.exe"
const { exec } = require("child_process")
const fs = require("fs")
const temp_php = `${__dirname}/compiler-temp/` //path ke php.exe , biasa ditemukan di folder apache / xampp

module.exports = {
    Compile: async function (app, db) {
        app.post("/api/compile", async (req, res) => { // compile codes
            var lang = req.body.lang, code = req.body.code, compile, result = "", runtime = 0, success;
            switch (lang) {
                case "njs": compile = compiler.node; break;
                case "py": compile = compiler.python; break;
                case "c": compile = compiler.c; break;
                case "cpp": compile = compiler.cpp; break;
                case "jv": compile = compiler.java; break;
                default: return res.json({ success: false, runtime, result: "INVALID LANGUAGE" }); break;
            }
            try {
                const hrStart = process.hrtime();

                // console.log(await compile.runSource(code));
                let run = await compile.runSource(code);
                success = run.stderr.length > 0 ? false : true
                result = `${run.stderr.length > 0 ? `${run.stderr}\n\n` : ""}${run.stdout}`
                hrDiff = process.hrtime(hrStart);
                runtime = `${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms`;
                result.length < 1 ? result = "true" : 0;
            }
            catch (err) {
                result = err;
                success = false;
            }
            res.json({ success: success, runtime: runtime, result: result })
        })
    },

    iFrame: async function (app, db) {
        app.post("/api/iframe", async (req, res) => {
            var code = req.body.code, id = new Date().getTime() * Math.random(), result, success, runtime

            try {
                const hrStart = process.hrtime();

                await fs.writeFile(`${temp_php}/${id}.php`, code, function (err, data) { if (err) { return res.json({ err: err, stderr: "", stdout: "" }) } }); //simpan code ke .php file agar bisa dicompile php

                await exec(`${php} ${temp_php}/${id}.php`, async (err, stdout, stderr) => { //exec php
                    fs.unlink(`${temp_php}/${id}.php`, () => { //delete .php file
                        success = !err ? true : false;
                        result = !err ? `${stderr.length > 0 ? `${stderr}\n\n` : ""}${stdout}` : err + stderr;
                        let hrDiff = process.hrtime(hrStart);
                        runtime = `${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms`;
                        result.length < 1 ? result = "true" : 0;
                        res.json({ success: success, runtime: runtime, result: result })
                    });

                })

            }

            catch (err) { res.json({ success: false, runtime: 0, result: err }) }


        })
    }
}