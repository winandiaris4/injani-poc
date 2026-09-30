# Panduan Lengkap Deployment Injani Platform: VPS & Docker

Panduan arsitektur dan langkah demi langkah untuk mendeploy **Injani BPA & Continuous Controls Platform** ke **Virtual Private Server (VPS)** menggunakan **Docker & Docker Compose**.

---

## 1. Mengapa Pilihan VPS + Docker Sangat Tepat?

1. **Kedaulatan Data & Keamanan Enterprise (*Data Sovereignty*)**:
   - Untuk platform kendali kepatuhan seperti **ISO27001** dan **SOX**, menjalankan sistem di server mandiri (*self-hosted / on-premise VPS*) memberikan kendali 100% atas log audit, enkripsi, dan isolasi jaringan tanpa ketergantungan pada vendor SaaS pihak ketiga.
2. **Optimalisasi Next.js Standalone (*Ultra-Lightweight*)**:
   - Konfigurasi `output: "standalone"` pada `next.config.ts` memangkas ukuran Docker image dari **~1.2 GB** menjadi hanya **~140 MB**, menghemat RAM dan mempercepat waktu *boot* di VPS.
3. **Eksekusi Aman Non-Root**:
   - Kontainer dijalankan di bawah akun sistem `nextjs:nodejs` (UID 1001) yang memenuhi standar kepatuhan isolasi kontainer (*Container Hardening*).

---

## 2. Arsitektur Jaringan Produksi

```
[ Klien / Browser ]
        |
        v  HTTPS (Port 443) / HTTP (Port 80)
[ Reverse Proxy: Caddy / Nginx ]  <-- Otomatis Let's Encrypt SSL
        |
        v  HTTP (127.0.0.1:3000)
[ Docker Container: injani-platform ]
  • Node.js 20 Alpine (Standalone)
  • Healthcheck aktif setiap 30s
  • Logging berbatas (max 10MB x 3 file)
```

---

## 3. Berkas Konfigurasi yang Telah Disediakan

Semua berkas berikut sudah siap di direktori proyek:
- `Dockerfile`: Multi-stage build (*deps* -> *builder* -> *runner*).
- `docker-compose.yml`: Orkestrasi kontainer dengan limit memori (1GB), restart policy, dan healthcheck.
- `.dockerignore`: Mengecualikan `node_modules`, `.next`, dan berkas lokal agar proses build cepat.
- `.env.example`: Template variabel lingkungan produksi.

---

## 4. Langkah Demi Langkah Deployment di VPS

### Langkah 1: Persiapan Server VPS (Ubuntu 22.04 / 24.04 LTS)
Masuk ke VPS via SSH dan instal Docker Engine:

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Instal Docker & Docker Compose Plugin resmi
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambahkan user aktif ke grup docker (opsional agar tidak perlu sudo)
sudo usermod -aG docker $USER

# Konfigurasi firewall (UFW)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

### Langkah 2: Clone Repository & Konfigurasi Lingkungan

```bash
# Masuk ke direktori web/app
cd /var/www  # atau di home user ~/app

# Clone repo proyek
git clone <URL_REPOSITORY_ANDA> injani-app
cd injani-app/prototype-injani

# Siapkan file .env produksi
cp .env.example .env
```

Isi `.env` jika diperlukan penyesuaian:
```env
PORT=3000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

### Langkah 3: Build & Jalankan Kontainer

Jalankan perintah Docker Compose untuk membangun image dan menyalakan kontainer di background:

```bash
docker compose up -d --build
```

**Perintah Monitoring Kontainer:**
```bash
# Cek status kesehatan kontainer (healthy / starting)
docker compose ps

# Membaca log realtime
docker compose logs -f injani-platform

# Menghentikan layanan
docker compose down

# Merestart layanan
docker compose restart
```

---

### Langkah 4: Setup Domain & SSL Gratis Otomatis (Reverse Proxy)

Gunakan **Caddy Server** (sangat direkomendasikan karena mengurus sertifikat SSL Let's Encrypt secara otomatis tanpa konfigurasi rumit Certbot).

#### Opsi A: Menggunakan Caddy (Paling Mudah & Modern)

1. Instal Caddy di VPS:
   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
   curl -1sLF 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLF 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy -y
   ```

2. Edit `/etc/caddy/Caddyfile`:
   ```caddy
   app.perusahaan-anda.com {
       reverse_proxy 127.0.0.1:3000
   }
   ```

3. Restart Caddy:
   ```bash
   sudo systemctl restart caddy
   ```
   *Selesai! Domain langsung aktif dengan HTTPS (SSL otomatis).*

---

#### Opsi B: Menggunakan Nginx + Certbot

Jika VPS Anda sudah menggunakan Nginx:

1. Buat file konfigurasi `/etc/nginx/sites-available/injani`:
   ```nginx
   server {
       server_name app.perusahaan-anda.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. Aktifkan dan pasang SSL Certbot:
   ```bash
   sudo ln -s /etc/nginx/sites-available/injani /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   sudo certbot --nginx -d app.perusahaan-anda.com
   ```

---

## 5. Script Pembaruan Cepat (One-Command Update)

Ketika Anda melakukan update kode dari Git di masa mendatang, cukup jalankan script berikut di VPS:

```bash
git pull origin main
docker compose up -d --build
```
Proses build hanya memakan waktu ~30 detik karena cache layer Docker Dependency (`npm ci`) tetap utuh selama `package-lock.json` tidak berubah.
