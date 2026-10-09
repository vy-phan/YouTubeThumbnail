# Hướng dẫn Deploy lên GitHub Pages

## Cấu hình đã hoàn tất

Dự án đã được cấu hình sẵn để deploy lên GitHub Pages như một web static tĩnh.

### Các thay đổi đã thực hiện:

1. **index.html**: Thêm favicon icon YouTube (`/assets/ytb.png`)
2. **vite.config.ts**: Cấu hình `base: '/youtube-thumbnail-extractor/'` cho GitHub Pages
3. **package.json**: Thêm `gh-pages` dependency và script deploy

## Cách Deploy thủ công

### Bước 1: Cài đặt dependencies
```bash
bun install
```

### Bước 2: Build dự án
```bash
bun run build
```

### Bước 3: Deploy lên GitHub Pages
```bash
bun run deploy
```

Lệnh này sẽ:
- Build dự án vào thư mục `dist/`
- Tạo branch `gh-pages` trên GitHub
- Upload nội dung thư mục `dist/` lên branch đó
- GitHub Pages sẽ tự động host từ branch `gh-pages`

## Cấu hình GitHub Pages trên GitHub

1. Vào repository trên GitHub
2. Click **Settings** → **Pages**
3. Trong phần **Source**, chọn:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

Sau vài phút, web sẽ được deploy tại:
```
https://username-github.github.io/youtube-thumbnail-extractor/
```

## Lưu ý quan trọng

- Nếu tên repository của bạn khác `youtube-thumbnail-extractor`, hãy sửa `base` trong `vite.config.ts`:
  ```ts
  base: '/tên-repository-của-bạn/',
  ```

- Sau khi thay đổi tên repository, hãy chạy lại:
  ```bash
  bun run build
  bun run deploy
  ```

## Thay đổi icon YouTube

Icon YouTube đã được thay thế bằng file `assets/ytb.png` tại các vị trí:
- Navbar (header)
- Footer
- Nút "Xem trên YouTube" trong VideoInfoCard
- Favicon của trang web
