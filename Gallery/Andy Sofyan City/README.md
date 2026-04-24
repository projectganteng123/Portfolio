# Urban Frames — Photography Portfolio

Portfolio website untuk urban photography dengan tone cream & warm.

## Cara Publish ke GitHub Pages

### 1. Buat Repository
1. Buka [github.com](https://github.com) → klik **New repository**
2. Nama repo: `urban-frames` (atau nama apapun)
3. Set ke **Public**
4. Klik **Create repository**

### 2. Upload File
Upload 3 file ini ke root repository:
- `index.html`
- `style.css`
- `script.js`

Bisa via drag & drop di halaman GitHub, atau pakai Git:
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/urban-frames.git
git push -u origin main
```

### 3. Aktifkan GitHub Pages
1. Di repository → **Settings**
2. Kiri bawah → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** → folder: **/ (root)**
5. Klik **Save**

Setelah 1–2 menit, website live di:
`https://USERNAME.github.io/urban-frames/`

---

## Cara Ganti Foto

Buka `index.html` dan ganti URL foto di bagian:
- **Hero slideshow** — cari tag `<div class="slide-bg" style="background-image: url('...')">`
- **Gallery grid** — cari tag `<img src="..." />`

Bisa pakai foto lokal (taruh di folder `images/`) atau URL langsung dari Unsplash/CDN.

Contoh pakai foto lokal:
```html
<img src="images/foto-kota.jpg" alt="Foto kota" />
```

## Cara Ganti Nama Fotografer

Di `index.html`, cari `Alex Wardana` dan ganti dengan nama yang sebenarnya.

## Struktur File
```
urban-frames/
├── index.html    ← Struktur halaman
├── style.css     ← Semua styling
├── script.js     ← Slideshow, filter, lightbox
└── README.md
```
