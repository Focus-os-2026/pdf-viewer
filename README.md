# PDF Viewer — ผลงานนวัตกรรม ววน.

เว็บอ่าน PDF สำหรับ GitHub Pages ใช้ PDF.js และโหลดไฟล์จาก Google Drive ผ่าน Google Apps Script (Apps Script) โดยไม่เก็บ PDF ใน repository รองรับ `?page=4`, การเลื่อนดูทั้งเล่ม, ปุ่มเปลี่ยนหน้า และซูม

> **สถานะ: ยังไม่พร้อมใช้งานจริง** ต้องติดตั้งและ Deploy Apps Script แล้วนำ URL มาใส่ใน `index.html` ก่อน และควรทดสอบกับ PDF จริงผ่านเว็บไซต์ที่เผยแพร่แล้ว ระบบนี้ยังไม่ได้ทดสอบการโหลดไฟล์จาก Drive หรือแสดงหน้า 4 เพราะต้องใช้ URL Web App ที่ผู้ดูแล Deploy และสิทธิ์เข้าถึงไฟล์

## ไฟล์และการไหลของข้อมูล

- `index.html` เป็นหน้า static ของ GitHub Pages; PDF.js โหลดผ่าน CDN
- `apps-script/Code.gs` เป็นตัวกลางส่งข้อมูล PDF จาก Drive ในรูป Base64 JSONP เพื่อหลีกเลี่ยง CORS โดยไม่เปิดเผย API key หรือ access token ในเว็บไซต์
- File ID ถูกกำหนดไว้ใน Apps Script: `1cPw_QqntEvepwkR0Bbyx1VZR6Y4qtAav`
- ตัวกลางอ่านไฟล์ปัจจุบันตาม File ID ทุกครั้ง ดังนั้นการอัปโหลดไฟล์เวอร์ชันใหม่โดยรักษา File ID เดิมจะใช้ QR Code/เว็บไซต์ URL เดิมได้

## ตั้งค่า Google Apps Script

1. เปิด [script.google.com](https://script.google.com/) ด้วยบัญชี Google ที่เข้าถึง PDF ใน Drive ได้ แล้วสร้างโปรเจกต์ Apps Script ใหม่
2. คัดลอกเนื้อหา `apps-script/Code.gs` ใน repository นี้ไปวางในไฟล์ `Code.gs` แล้วบันทึก
3. ในค่าคงที่ `MAX_PDF_BYTES` กำหนดขนาดไฟล์สูงสุดตามความเหมาะสม (ค่าเริ่มต้น 10 MiB) ดูข้อจำกัดด้านล่าง
4. เลือก **Deploy > New deployment** แล้วเลือกประเภท **Web app**
5. ตั้ง **Execute as: Me** และ **Who has access: Anyone** เพื่อให้ผู้เข้าชม QR Code เรียก Web App ได้ โดย Web App จะให้สิทธิ์อ่านไฟล์ที่รันในนามบัญชีผู้ Deploy
6. กด Deploy, อนุญาตสิทธิ์ที่ Google ขอ และคัดลอก URL ที่ลงท้ายด้วย `/exec` (ไม่ใช่ URL `/dev`)
7. เปิด `index.html` แล้วแทนค่าบรรทัด `const PDF_PROXY_URL = '';` ด้วย URL `/exec` ที่ได้ เช่น `const PDF_PROXY_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';` จากนั้น commit การเปลี่ยนแปลงนี้
8. ใน GitHub ไปที่ **Settings > Pages** แล้วตั้ง Source ให้เผยแพร่จาก branch `main`, โฟลเดอร์ `/(root)` หากยังไม่ได้เปิดใช้งาน
9. ทดสอบเว็บไซต์จริง: `https://focus-os-2026.github.io/pdf-viewer/?page=4` ตรวจว่ามี PDF แสดงหน้า 4, เลื่อนไปหน้าอื่นได้, ปุ่มก่อนหน้า/ถัดไปและช่องเลขหน้าทำงาน และทดสอบบน iPhone/Android ด้วย หากล้มเหลวให้ดูข้อความผิดพลาดในหน้าและ Console ของเบราว์เซอร์

การ Deploy แบบ **Anyone** หมายความว่าผู้ที่ทราบ URL ของ Web App สามารถเรียกตัวกลางและรับ PDF ได้ จึงต้องใช้เฉพาะเอกสารที่อนุญาตให้เผยแพร่ต่อสาธารณะ ห้ามวาง OAuth token, API key หรือข้อมูลรับรองใน HTML/JavaScript ฝั่งเว็บ

## URL สำหรับ QR Code

- `https://focus-os-2026.github.io/pdf-viewer/?page=4`
- `https://focus-os-2026.github.io/pdf-viewer/?page=10`
- `https://focus-os-2026.github.io/pdf-viewer/?page=20`

ทุก URL โหลดไฟล์จาก Drive File ID เดียวกัน และผู้ชมเลื่อนดูหน้าอื่นได้ URL parameter จะเปลี่ยนตามหน้าที่อ่านอยู่

## อัปเดต PDF และแคช

1. อัปโหลด PDF เวอร์ชันใหม่ใน Google Drive โดยใช้การแทนที่ไฟล์เดิม/จัดการเวอร์ชันของไฟล์ ไม่ลบไฟล์เดิมแล้วสร้างไฟล์ใหม่ เพราะการสร้างใหม่อาจทำให้ File ID เปลี่ยน
2. ตรวจสอบ File ID ของไฟล์ยังเป็น `1cPw_QqntEvepwkR0Bbyx1VZR6Y4qtAav` (เปิดลิงก์ Drive แล้วตรวจค่าใน URL)
3. หน้าเว็บส่ง query parameter ที่ไม่ซ้ำในทุกคำขอเพื่อช่วยลดการได้ไฟล์เก่าจาก browser/CDN cache; หลังอัปเดตให้ปิด/เปิดหน้าใหม่หรือรีโหลดแบบไม่ใช้แคช หากยังเห็นข้อมูลเดิม ให้รอสักครู่แล้วลองใหม่
4. URL เว็บไซต์/QR Code ไม่ต้องเปลี่ยนเมื่อ File ID เดิมคงอยู่

## ข้อจำกัดสำคัญ

- GitHub Pages เป็น Static Hosting: ไม่สามารถเก็บ secret ฝั่ง server หรือทำ proxy backend ให้เองได้; Apps Script เป็น backend แยกต่างหากที่ผู้ใช้ต้อง Deploy และดูแล
- ตัวอย่าง Apps Script นี้ส่ง PDF ทั้งไฟล์เป็น Base64 JSONP เพื่อไม่พึ่ง CORS และทำให้ PDF.js รับ bytes ได้ แต่ **ไม่ได้ใช้ HTTP Range requests**; จึงโหลดเอกสารทั้งไฟล์ก่อนแสดงหน้าแรก ใช้หน่วยความจำเพิ่มจาก Base64 ประมาณหนึ่งในสามและอาจช้าบนมือถือ
- ค่าเริ่มต้นจำกัดไฟล์ที่ 10 MiB อย่างระมัดระวัง ขนาดใหญ่กว่านี้อาจทำให้สคริปต์ช้า/หมดเวลา ใช้หน่วยความจำมาก หรือชน quota/ข้อจำกัดการตอบกลับของ Apps Script และเบราว์เซอร์ การเพิ่มค่าขีดจำกัดไม่ได้รับประกันว่าไฟล์ขนาดใหญ่จะทำงานได้ สำหรับ PDF ขนาดใหญ่ควรใช้ backend ที่รองรับ streaming และ Range (เช่น Cloud Run/บริการ proxy ที่ตั้งค่า CORS, cache และการยืนยันสิทธิ์อย่างเหมาะสม) แทน ไม่ควรใช้ API key ฝังในหน้าเว็บ
- PDF.js และ worker ถูกโหลดจาก CDN จึงต้องเชื่อมต่ออินเทอร์เน็ต
- เนื้อหาของไฟล์ PDF เป็นข้อมูลสาธารณะสำหรับทุกคนที่เข้าถึง Web App ได้ โปรดตรวจสอบสิทธิ์และความเหมาะสมก่อน Deploy

## ตรวจสอบด้วยตนเองก่อนเปิดใช้งาน

- [ ] Deploy Apps Script เป็น Web App แบบ Execute as Me / Anyone และใส่ URL `/exec` ใน `index.html`
- [ ] เปิด URL หน้า 4 แล้วตรวจว่า PDF จาก Drive โหลดสำเร็จจริง
- [ ] ทดสอบ page 4, page 10, การเลื่อนทั้งเล่ม, การซูม และหน้า error
- [ ] ทดสอบบน iPhone, Android และ Desktop
- [ ] ยืนยันว่าไฟล์ Drive เป็นสาธารณะ/อนุญาตให้เผยแพร่ และ Apps Script มีสิทธิ์อ่าน
