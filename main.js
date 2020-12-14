const express = require('express') /*Konstanta express untuk digunakan di konstanta app, pemanggilan paket node (Framework) ExpressJS*/
const app = express() /*Konstanta app untuk mempersingkat kode nantinya*/

app.get('/', (req, res) => {
    /*Mengirim request http dengan metode GET, dengan 2 parameter: (Absolute path, callback). 
    Callback adalah fungsi yang dipanggil setelah proses dari fungsi utama (app.get) sudah selesai berjalan.*/

    res.sendFile(__dirname + "/html/node.html", (err) => {
        /*Mengirim file untuk request GET, dengan 2 parameter (File Path, Error callback).
        Error callback akan berjalan jika ada terjadi error dalam proses request, dengan pesan error disimpan di variable "err".*/

        if (err.message.includes("ENOENT")) res.send("FILE NOT FOUND!")
        /*err.message adalah nama errornya (tanpa traceback) secara singkat dalam bentuk string,
        yang memiliki metode .includes untuk memudahkan pemisahan tipe error. 
        "ENOENT" adalah nama error ketika Node.JS gagal menemukan sesuatu yang diminta karena tidak ada.*/

        else res.send(err) //Jika error bukanlah "ENOENT", kirim ke request error apakah itu.
    })
})

app.listen("3000") //Membuka http listener di localhost:3000
console.log("Ready"); //Terpanggil setelah semua proses selesai, dan aplikasi siap untuk digunakan
