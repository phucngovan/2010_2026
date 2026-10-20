# 💖 Gửi vợ yêu — 20/10

Món quà nhỏ nhân ngày Phụ nữ Việt Nam.

## Chỉnh nội dung
Mọi chữ, ngày tháng, ảnh, nhạc đều nằm trong [`config.js`](config.js).

- **Hành trình**: mỗi chặng (tiêu đề, lời, ảnh) nằm trong `timeline`. Ảnh ngang thêm `wide: true`, chỉnh phần ảnh bị cắt bằng `pos: "50% 30%"`.
- **Ảnh**: bỏ ảnh vào `assets/photos/` rồi điền đường dẫn vào `photos[].src`, ví dụ `"assets/photos/1.jpg"`.
- **Nhạc nền**: bỏ file vào `assets/` rồi điền `music: "assets/music.mp3"`.
- **Ngày bên nhau**: sửa `startDate` (định dạng `NĂM-THÁNG-NGÀY`).

Sau khi sửa: `git add . && git commit -m "cập nhật" && git push` — GitHub Pages tự cập nhật sau khoảng 1 phút.
