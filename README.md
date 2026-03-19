# Slip Audit — ระบบตรวจสอบรายการฝาก

## Deploy บน Vercel

### 1. Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/slip-audit.git
git push -u origin main
```

### 2. Import ใน Vercel
- ไปที่ [vercel.com](https://vercel.com) → New Project
- Import repository นี้
- Framework Preset: **Other**
- Root Directory: `.` (default)
- กด Deploy

### 3. ตั้งค่า Environment Variable
ใน Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-xxxxxx` |

กด Save แล้ว Redeploy

### โครงสร้างไฟล์
```
slip-audit/
├── api/
│   └── claude.js        ← Vercel Function (proxy ไปหา Anthropic)
├── public/
│   └── index.html       ← หน้าเว็บหลัก
├── vercel.json
├── package.json
└── .gitignore
```

### วิธีทำงาน
- `public/index.html` เรียก `/api/claude` (ไม่มี API key ใน browser)
- `api/claude.js` รับ request → ใส่ API key → ส่งต่อไป Anthropic
- API key เก็บใน Vercel Environment Variable ปลอดภัย 100%
