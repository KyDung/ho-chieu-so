# Hộ chiếu số – Tin học 10, Bài 10

Web hỗ trợ 2 tiết thực hành **Bài 10. Thực hành khai thác tài nguyên trên Internet**. Học sinh đi qua 7 trạm, qua mỗi trạm được đóng một con dấu vào "hộ chiếu". Các em thao tác trên **công cụ thật** (Google Dịch, camera dịch, dịch trang của trình duyệt, kho học liệu mở). Sản phẩm được nộp lên **Padlet** chỉ bằng một nút bấm.

Đây là web tĩnh: không máy chủ, không đăng nhập. Bài làm lưu trong trình duyệt của từng máy.

| Tệp | Dùng để |
|---|---|
| `index.html` | Trang học sinh (bản đồ hành trình, 7 trạm, hộ chiếu) |
| `teacher.html` | Trang giáo viên: dán link Padlet, mã QR, đồng hồ, trình chiếu, đáp án, rubric |
| `js/config.js` | Link Padlet cố định (không bắt buộc), địa chỉ trang học sinh |
| `js/data.js` | Toàn bộ nội dung các trạm (sửa câu chữ tại đây) |
| `js/answers.js` | Đáp án đọc được, **chỉ trang giáo viên tải** |
| `assets/` | Tài nguyên giải mã: biển tiếng Hàn, poster tiếng Nhật, thư Word tiếng Tây Ban Nha, trang web tiếng Nga |

## 1. Các trạm

| Tiết | Trạm | Học sinh làm gì | Đánh giá |
|---|---|---|---|
| 1 | Khởi động – Tấm biển lạ (5') | Tình huống gặp biển báo tiếng Pháp ở thư viện: chọn cách xử lí đúng (trắc nghiệm), xem bản dịch | Tự chấm |
| 1 | Trạm 1 – Khám phá Google Dịch (8') | Đọc trang giới thiệu 8 tính năng của Google Dịch, rồi giải 7 tình huống (có ảnh minh hoạ) | Tự chấm, có "cách làm" |
| 1 | Trạm 2 – Phá 3 ổ khoá (12') | Dịch ảnh tiếng Nhật, tệp Word tiếng Tây Ban Nha, trang web tiếng Nga để tìm 3 từ khoá | Web tự kiểm tra (đáp án lưu dạng mã băm) |
| 1 | Trạm 3 – Dịch thư gửi bạn quốc tế (15') | Đọc lá thư tiếng Việt có sẵn → dịch sang tiếng Anh bằng Google Dịch → nghe và kiểm tra lại. Web kiểm tra sơ bộ bản dán và độ dài; học sinh tự so ý với thư gốc | Bản dịch lưu lại, nộp ở Về đích |
| 2 | Trạm 4 – Học liệu mở & giấy phép (10') | Đọc hiểu học liệu mở, kí hiệu CC, **quy tắc ghép CC → BY → (NC) → (SA hoặc ND)**; 4 câu viết đúng/sai + 7 tình huống | Tự chấm |
| 2 | Trạm 5 – Săn học liệu mở (15') | Chọn 1 trong 8 bài học → tìm trên Google (từ khoá điền sẵn) → mở trang học liệu đáng tin → dán link | Link lưu lại, nộp ở Về đích |
| 2 | Về đích (8') | 6 câu tình huống + 1 câu suy ngẫm → hiện **toàn bộ bài làm** → nộp Padlet **một lần** | Toàn bộ bài → Padlet |

Đáp án 3 ổ khoá (chấp nhận tiếng Việt hoặc tiếng Anh, có dấu hay không dấu): hướng dương / sunflower · bướm / butterfly · cầu vồng / rainbow.

## 2. Ảnh minh hoạ Trạm 1

Đặt ảnh vào `assets/tram1/`, đặt tên theo tệp `assets/tram1/DANH_SACH_ANH.md` (ví dụ `cau-1.png` … `cau-7.png`). Ảnh nào chưa có thì web tự ẩn khung ảnh.

## 3. Thiết lập Padlet (khoảng 5 phút)

Link Padlet của lớp đã được điền sẵn trong `js/config.js`. Muốn đổi thì sửa ở đó hoặc dán link mới trên trang giáo viên.


1. padlet.com → **Tạo** một Padlet bất kỳ (dạng Tường/Lưới đều được) — **không cần chia cột**, vì mỗi học sinh chỉ đăng bài 1 lần cho phần trên lớp và 1 lần cho phần Vận dụng, phân biệt bằng tiêu đề bài đăng.
2. **Chia sẻ** → quyền khách truy cập: **Có thể viết**, để học sinh đăng bài không cần tài khoản.
3. Mở `teacher.html` → tab **⚙️ Chuẩn bị** → dán link Padlet → **Lưu link**.
   - Mã QR trang học sinh sẽ **tự kèm link Padlet**. Học sinh quét QR là nút "Sao chép & mở Padlet" hoạt động ngay.
   - Nút **Sao chép link (gửi Zalo)** cho link cũng đã kèm Padlet.
   - Muốn cố định cho mọi máy (kể cả máy mở trực tiếp tệp), điền `padletUrl` trong `js/config.js`.
4. Học sinh cũng có thể tự dán link Padlet ở trang Bản đồ nếu thầy cô gửi riêng.

**Học sinh nộp bài:** ở các trạm chỉ bấm **Hoàn thành** để lưu. Sau chặng **Về đích**, web hiện toàn bộ bài làm và nút **Sao chép toàn bộ bài & mở Padlet** → bấm **+** để đăng bài mới, tiêu đề ghi `Bài làm trên lớp – Họ tên – Lớp` → **Ctrl + V** → Đăng → quay lại web bấm **Em đã nộp**. Bài Vận dụng về nhà cũng đăng riêng một lần, tiêu đề `Vận dụng – Họ tên – Lớp`.

## 4. Chạy web

- **Khuyên dùng: GitHub Pages** (giống Bài 9). Đưa cả thư mục `Web_Bai10` lên repo, bật Pages, mở `.../teacher.html`. Trạm 2 (dịch trang web tiếng Nga) chạy tốt nhất khi web ở trên mạng.
- **Máy chủ tạm trong phòng máy:** chạy `python -m http.server 8000` trong thư mục, học sinh mở `http://<IP máy GV>:8000`. Nên điền địa chỉ này vào `studentUrl` trong `config.js`.
- Mở trực tiếp `index.html` cũng chạy được, nhưng mã QR chỉ dùng được trên chính máy đó.

## 5. Kiểm tra trước giờ dạy

- Đi thử một vòng trang học sinh trên máy phòng máy, đặc biệt 3 ổ khoá: thẻ **Hình ảnh** và **Tài liệu** của Google Dịch, và "Dịch sang Tiếng Việt" của Chrome/Edge.
- Kiểm tra các kho học liệu ở Trạm 5 truy cập được từ mạng trường.
- Cho phép học sinh dùng điện thoại ở phần Khởi động.
- Dùng nút **🗑 Xoá dữ liệu trên máy này** (trang Hộ chiếu) khi lớp khác dùng lại máy.
