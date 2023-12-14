## Cara menjalankan project

Pertama, clone project ini ke local:
```bash
git clone https://github.com/rezacahyono/counseling.git
```
Jalankan perintah ini untuk menginstal dependency:
```bash
npm i
#or
npm install
```
Pastikan server database kamu sudah aktif. Jika menggunakan XAMPP pastikan mysql sudah aktif.

Jalankan perintah ini untuk menggenarated schema database:
```bash
npx prisma db push
```
Secara otomatis database akan dibuat, cek di `localhost/phpmyadmin` dengan nama database `counseling_db`.

Setelah itu jalankan mode development
```bash
npm run dev
```