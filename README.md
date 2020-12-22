# forumTI

Aplikasi ini adalah sebagai penilaian untuk tugas besar dalam mata kuliah Interaksi Manusia dan Komputer.

## Platform

Aplikasi ini berbasis Angular untuk front end, Express + NodeJS untuk back end, dan MongoDB sebagai sistem basis data.

## Apa yang dibutuhkan

Sebelum kita dapat menjalankan aplikasi ini, setidaknya ada 3 aplikasi yang sudah terinstall pada perangkat server, yaitu:

1. NodeJS (Minimum v10) - Download dari [Website resmi NodeJS](https://nodejs.org/en/download/)
2. Angular CLI (Latest version) - Install menggunakan terminal / console setelah menginstall NodeJS dengan perintah `npm i --g @angular/cli`
3. MongoDB (Minimum Community Edition) - Download dari [Website resmi MongoDB](https://www.mongodb.com/try/download/community)

Untuk dapat menggunakan fitur "Compile Run" perangkat server membutuhkan compiler untuk masing masing bahasa pemrograman, yaitu:

1. C dan C++ - Membutuhkan gcc
2. Java - Membutuhkan jdk
3. Python - Membutuhkan python
4. JavaScript - Membutuhkan NodeJS
5. PHP - Membutuhkan php.exe (Dapat ditemukan didalam folder xampp/php/, harus konfigurasi manual didalam backend/js/compiler.js)

## Jalankan

Untuk menjalankan aplikasi ini, akan dibutuhkan 2 console / terminal untuk menjalankan sisi front-end dan back-end.

- Pada terminal 1, jalankan `ng serve` pada directory utama dari aplikasi ini.
- Pada terminal 2, jalankan `node .` atau `nodemon .` didalam folder backend yang terdapat pada folder utama aplikasi ini (`./backend/`).

## Buka

Setelah aplikasi dijalankan, aplikasi akan memakai port 4200 (localhost:4200) untuk sisi front-end, dan port 3030 (localhost:3030) untuk sisi back-end.

Silahkan buka localhost:4200 pada browser untuk membuka aplikasi ini.