# PDF Viewer สำหรับ QR Code ใน Canva

เว็บไซต์อ่าน PDF ผ่าน PDF.js รองรับลิงก์ `?page=4` และเปิดดูหน้าอื่นได้

## ตั้งค่าบน GitHub

1. สร้าง **Public repository** ชื่อ `pdf-viewer` บน GitHub
2. อัปโหลด `index.html` และ `.nojekyll` จาก ZIP นี้ลงใน root ของ repository
3. ดาวน์โหลดไฟล์ PDF ต้นฉบับจาก Google Drive และคงชื่อไฟล์เป็น **ผลงานนวัตกรรม ววน.pdf** (ชื่อต้องตรงทุกตัวอักษร)
4. อัปโหลด `ผลงานนวัตกรรม ววน.pdf` ลงใน root ของ repository เดียวกัน
5. ไปที่ Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save
6. เมื่อเว็บไซต์เผยแพร่แล้ว ลิงก์จะเป็น `https://USERNAME.github.io/pdf-viewer/?page=4` (แทน USERNAME ด้วยชื่อ GitHub)
7. ทดลองเปิด URL ผ่าน iPhone และ Android ให้แน่ใจว่าเริ่มหน้า 4 ก่อนใช้สร้าง QR Code ใน Canva

**ข้อควรทราบ:** ไฟล์บน GitHub Pages เผยแพร่สู่สาธารณะ อย่าอัปโหลด PDF ที่เป็นความลับ หรือติดข้อจำกัดการเผยแพร่ ขนาดไฟล์เกิน 25MB อาจอัปโหลดผ่านหน้าเว็บไซต์ GitHub ไม่ได้

## ลิงก์ที่ใช้สร้าง QR Code
- `https://USERNAME.github.io/pdf-viewer/?page=4`
- `https://USERNAME.github.io/pdf-viewer/?page=10`

เปลี่ยนเลขหน้าโดยไม่ต้องสร้างเว็บใหม่ ตัวอ่านไฟล์มีปุ่มก่อนหน้า/ถัดไปและช่องกรอกเลขหน้า
