// ============================================================
// NỘI DUNG HỘ CHIẾU SỐ – BÀI 10. Sửa câu chữ trực tiếp tại đây.
// Đáp án các ổ khoá được lưu dạng mã băm (hash) để học sinh không xem trộm;
// đáp án đọc được nằm trong js/answers.js (chỉ trang giáo viên dùng).
// Thứ tự trong mảng stations = thứ tự các trạm trên bản đồ.
// ============================================================
window.B10 = {
  stations: [
    { id: 'warm', no: 'Khởi động', name: 'Tấm biển lạ', short: 'KHỞI ĐỘNG', emoji: '📷', color: '#f97316', time: '5 phút', part: 1,
      goal: 'Gặp một tấm biển tiếng nước ngoài ở thư viện, em sẽ làm gì?' },
    { id: 'tools', no: 'Trạm 1', name: 'Khám phá Google Dịch', short: 'CÔNG CỤ', emoji: '🧰', color: '#8b5cf6', time: '8 phút', part: 1,
      goal: 'Tìm hiểu các tính năng của Google Dịch, rồi chọn đúng tính năng cho 7 tình huống.' },
    { id: 'locks', no: 'Trạm 2', name: 'Phá 3 ổ khoá', short: 'PHÁ KHOÁ', emoji: '🔐', color: '#ef4444', time: '12 phút', part: 1,
      goal: 'Dịch một bức ảnh, một tệp Word và một trang web để tìm 3 từ khoá.' },
    { id: 'desk', no: 'Trạm 3', name: 'Dịch thư gửi bạn quốc tế', short: 'LÁ THƯ', emoji: '✉️', color: '#0ea5e9', time: '15 phút', part: 1,
      goal: 'Dùng Google Dịch chuyển lá thư tiếng Việt có sẵn sang tiếng Anh, nghe lại và kiểm tra bản dịch.' },
    { id: 'lic', no: 'Trạm 4', name: 'Học liệu mở & giấy phép', short: 'BẢN QUYỀN', emoji: '⚖️', color: '#f59e0b', time: '10 phút', part: 2,
      goal: 'Hiểu học liệu mở là gì và đọc được giấy phép Creative Commons trước khi dùng lại tài nguyên.' },
    { id: 'hunt', no: 'Trạm 5', name: 'Săn học liệu mở', short: 'HỌC LIỆU', emoji: '📚', color: '#10b981', time: '15 phút', part: 2,
      goal: 'Chọn một bài học, tự tìm trên Google một trang học liệu đáng tin về bài đó và dán link.' },
    { id: 'exit', no: 'Chặng cuối', name: 'Về đích', short: 'VỀ ĐÍCH', emoji: '🏁', color: '#6366f1', time: '8 phút', part: 2,
      goal: '6 tình huống cuối cùng để kiểm tra em đã sẵn sàng tự học với Internet.' },
  ],

  // ---------- KHỞI ĐỘNG ----------
  warm: {
    img: 'assets/bien-thu-vien.png',
    scenario: 'Em đi du học ở Pháp. Ngày đầu tiên đến thư viện thành phố, em thấy tấm biển này ở cửa phòng đọc nhưng không biết tiếng Pháp.',
    q: 'Em nên làm gì để biết tấm biển viết gì?',
    o: [
      'Đoán nghĩa dựa vào mấy biểu tượng trên biển rồi đi vào',
      'Mở ứng dụng Google Dịch, bấm Máy ảnh (hoặc dùng Google Lens) hướng vào tấm biển để dịch',
      'Gõ lại từng chữ tiếng Pháp vào ô tìm kiếm Google',
      'Chụp ảnh gửi bạn bè, chờ bạn nào biết tiếng Pháp trả lời',
    ],
    a: 1,
    e: 'Camera dịch đọc được chữ trong ảnh và hiện bản dịch ngay trên tấm biển, nhanh và chính xác nhất. Gõ lại từng chữ rất lâu và dễ gõ sai dấu tiếng Pháp; đoán nghĩa hoặc chờ bạn trả lời đều không chắc chắn.',
    translation: [
      ['BIBLIOTHÈQUE MUNICIPALE – Salle de lecture, 1er étage', 'THƯ VIỆN THÀNH PHỐ – Phòng đọc, tầng 1'],
      ["Silence, s'il vous plaît", 'Vui lòng giữ yên lặng'],
      ['Interdit de manger et de boire', 'Cấm ăn uống'],
      ['Maximum 5 livres par personne', 'Tối đa 5 cuốn sách mỗi người'],
      ['Ouvert : lundi – samedi, 9h – 18h', 'Mở cửa: thứ Hai – thứ Bảy, 9 giờ – 18 giờ'],
    ],
    fact: 'Camera dịch hoạt động nhờ trí tuệ nhân tạo: máy nhận dạng chữ trong ảnh (OCR), dịch, rồi đặt bản dịch đè lên đúng vị trí chữ gốc. Ở Trạm 1 em sẽ tìm hiểu thêm các tính năng khác của Google Dịch.',
  },

  // ---------- TRẠM 1: KHÁM PHÁ GOOGLE DỊCH ----------
  // Ảnh minh hoạ đặt trong assets/tram1/ (xem assets/tram1/DANH_SACH_ANH.md). Thiếu ảnh thì web tự ẩn khung ảnh.
  tools: {
    about: 'Google Dịch (Google Translate) là phần mềm dịch miễn phí của Google, hỗ trợ hơn 200 ngôn ngữ. Em dùng được trên máy tính tại translate.google.com hoặc trên điện thoại qua ứng dụng Google Dịch. Ngày nay Google Dịch không chỉ dịch chữ gõ vào mà còn dịch lời nói, ảnh, tệp, cả trang web.',
    features: [
      { key: 'text', icon: '⌨️', name: 'Văn bản', where: 'Web + App', img: 'tinh-nang-van-ban',
        what: 'Gõ hoặc dán chữ vào khung bên trái, bản dịch hiện bên phải.',
        extra: ['Chọn ngôn ngữ nguồn và đích ở hai ô phía trên (hoặc để "Phát hiện ngôn ngữ").', '⇄ đảo chiều dịch; 🔊 nghe đọc; 📋 sao chép bản dịch.'] },
      { key: 'voice', icon: '🎤', name: 'Giọng nói', where: 'Web + App', img: 'tinh-nang-giong-noi',
        what: 'Bấm micro rồi nói, máy tự chuyển lời nói thành chữ và dịch.',
        extra: ['Dùng để luyện nói: đọc to, xem máy có nhận đúng không.'] },
      { key: 'camera', icon: '📷', name: 'Hình ảnh / Máy ảnh', where: 'Web: thẻ Hình ảnh · App: Máy ảnh', img: 'tinh-nang-hinh-anh',
        what: 'Dịch chữ có trong ảnh. Trên app, hướng camera vào biển báo, thực đơn là bản dịch hiện đè lên chữ.',
        extra: ['Trên máy tính: thẻ Hình ảnh → chọn hoặc dán ảnh.'] },
      { key: 'doc', icon: '📄', name: 'Tài liệu', where: 'Web: thẻ Tài liệu', img: 'tinh-nang-tai-lieu',
        what: 'Dịch cả một tệp Word, PowerPoint, Excel hoặc PDF mà vẫn giữ bố cục.',
        extra: ['Chọn tệp → Dịch → Tải bản dịch xuống.'] },
      { key: 'web', icon: '🌐', name: 'Trang web', where: 'Web: thẻ Trang web · Chrome, Edge', img: 'tinh-nang-trang-web',
        what: 'Dịch toàn bộ một trang web sang tiếng Việt để đọc ngay trên trình duyệt.',
        extra: ['Nhanh nhất: chuột phải vào trang → "Dịch sang Tiếng Việt" (tính năng dịch có sẵn trong Chrome/Edge).'] },
      { key: 'convo', icon: '🗣️', name: 'Hội thoại', where: 'App', img: 'tinh-nang-hoi-thoai',
        what: 'Hai người nói hai thứ tiếng: máy nghe từng người, dịch và đọc to cho người kia.',
        extra: ['Dùng khi nói chuyện trực tiếp với người nước ngoài.'] },
      { key: 'hand', icon: '✍️', name: 'Viết tay', where: 'Web + App', img: 'tinh-nang-viet-tay',
        what: 'Vẽ chữ bằng chuột hoặc ngón tay khi gặp chữ lạ (chữ Hán, chữ Hàn…) không biết gõ.',
        extra: ['Bấm biểu tượng bút ✍️ trong khung nhập.'] },
      { key: 'captions', icon: '🎬', name: 'Phụ đề tự động dịch (YouTube)', where: 'YouTube', img: 'tinh-nang-phu-de',
        what: 'Công nghệ dịch của Google có sẵn trong YouTube: dịch phụ đề video sang tiếng Việt.',
        extra: ['⚙️ Cài đặt → Phụ đề → Tự động dịch → Tiếng Việt.'] },
    ],
    options: {
      text: { icon: '⌨️', label: 'Gõ từ vào ô Văn bản và bấm 🔊 để nghe' },
      voice: { icon: '🎤', label: 'Bấm micro để dịch lời một người nói' },
      camera: { icon: '📷', label: 'Dùng Máy ảnh để dịch chữ trong ảnh' },
      doc: { icon: '📄', label: 'Tải tệp lên thẻ Tài liệu để dịch' },
      web: { icon: '🌐', label: 'Dịch toàn bộ Trang web đang đọc' },
      convo: { icon: '🗣️', label: 'Dùng Hội thoại để dịch lời hai người nói qua lại' },
      captions: { icon: '🎬', label: 'Bật Phụ đề tự động dịch cho video' },
      hand: { icon: '✍️', label: 'Vẽ chữ bằng tính năng Viết tay' },
    },
    items: [
      { img: 'cau-1', sit: 'Em đang gọi món ở một quán ăn Hàn Quốc. Thực đơn in toàn chữ Hàn, em không biết đọc hay gõ lại. Em sẽ dùng cách nào để hiểu tên các món ngay tại bàn?', opts: ['text', 'camera', 'doc', 'convo'], a: 'camera',
        how: 'App Google Dịch → 📷 Máy ảnh → hướng vào thực đơn, bản dịch hiện đè lên chữ.' },
      { img: 'cau-2', sit: 'Cô giáo gửi cho lớp một tệp PDF tiếng Anh dài 12 trang. Em muốn dịch cả tệp sang tiếng Việt để đọc trước ở nhà. Em chọn cách nào?', opts: ['text', 'doc', 'web', 'camera'], a: 'doc',
        how: 'translate.google.com → thẻ Tài liệu → chọn tệp → Dịch → Tải bản dịch xuống.' },
      { img: 'cau-3', sit: 'Em mở một bài viết khoa học bằng tiếng Anh trên trang web của NASA và muốn đọc toàn bộ bài bằng tiếng Việt ngay trên trình duyệt. Em chọn cách nào?', opts: ['web', 'doc', 'convo', 'hand'], a: 'web',
        how: 'Chuột phải vào trang → "Dịch sang Tiếng Việt", hoặc dán địa chỉ trang vào thẻ Trang web của Google Dịch.' },
      { img: 'cau-4', sit: 'Một du khách hỏi em đường đến bảo tàng bằng tiếng Anh. Em trả lời bằng tiếng Việt, rồi hai người cần tiếp tục hỏi và đáp trực tiếp. Em mở tính năng nào trên ứng dụng Google Dịch để ứng dụng dịch lần lượt lời của cả hai?', opts: ['text', 'captions', 'convo', 'doc'], a: 'convo',
        how: 'App Google Dịch → Hội thoại: mỗi người lần lượt nói, máy dịch và đọc to cho người kia nghe.' },
      { img: 'cau-5', sit: 'Em xem một video bài giảng tiếng Anh trên YouTube nhưng người nói quá nhanh. Em muốn có dòng chữ tiếng Việt hiện dưới video để theo dõi nội dung. Em bật tính năng nào?', opts: ['captions', 'web', 'camera', 'voice'], a: 'captions',
        how: 'YouTube: ⚙️ Cài đặt → Phụ đề → Tự động dịch → Tiếng Việt. Có thể giảm tốc độ phát để luyện nghe.' },
      { img: 'cau-6', sit: 'Khi học từ vựng, em gặp từ tiếng Anh "schedule" và muốn nghe cách phát âm của riêng từ đó nhiều lần. Em chọn cách nào?', opts: ['doc', 'text', 'web', 'hand'], a: 'text',
        how: 'Gõ từ vào khung bên trái → bấm 🔊 để nghe, bấm nhiều lần để nghe lại.' },
      { img: 'cau-7', sit: 'Trong một cuốn sách có chữ Hán em chưa biết đọc, bàn phím của em cũng không gõ được chữ ấy. Em có thể đưa chữ vào Google Dịch bằng cách nào?', opts: ['hand', 'text', 'doc', 'convo'], a: 'hand',
        how: 'Bấm biểu tượng bút ✍️ (Viết tay) → vẽ chữ bằng chuột hoặc ngón tay → chọn chữ đúng.' },
    ],
  },

  // ---------- TRẠM 2: PHÁ 3 Ổ KHOÁ ----------
  locks: [
    { id: 'img', flag: '🏮', title: 'Dịch một bức ảnh', lang: 'Tiếng Nhật', type: 'Ảnh', asset: 'assets/poster-nhat.png', assetLabel: 'Xem poster', download: 'poster-nhat.png',
      steps: [
        'Cách 1 (điện thoại): app Google Dịch → 📷 Máy ảnh → hướng vào poster trên màn hình máy tính.',
        'Cách 2 (máy tính): bấm "Tải về" → translate.google.com → thẻ Hình ảnh → chọn tệp poster.',
        'Tìm câu nói về "mật khẩu" của lễ hội.',
      ],
      hashes: ['9zysjv', 'lwblru', '1j0dbxn', '1k5sbu8', '17py1pm'],
      hint: 'Mật khẩu là tên một loài hoa luôn quay về phía mặt trời 🌻.' },
    { id: 'doc', flag: '✉️', title: 'Dịch một tệp Word', lang: 'Tiếng Tây Ban Nha', type: 'Tệp Word', asset: 'assets/thu-tay-ban-nha.docx', assetLabel: 'Tải thư (.docx)', download: 'thu-tay-ban-nha.docx',
      steps: [
        'Bấm "Tải thư" để lưu tệp Word về máy.',
        'translate.google.com → thẻ Tài liệu → chọn tệp → chọn Tiếng Việt → Dịch.',
        'Đọc bản dịch (hoặc bấm Tải bản dịch xuống), tìm "từ bí mật" trong thư.',
      ],
      hashes: ['mjnuhs', 'fkvr1p', '12azqc', '1c6dsvr'],
      hint: 'Từ bí mật là một loài côn trùng có đôi cánh sặc sỡ 🦋.' },
    { id: 'web', flag: '📰', title: 'Dịch cả một trang web', lang: 'Tiếng Nga', type: 'Trang web', asset: 'assets/trang-nga.html', assetLabel: 'Mở trang web', download: '',
      steps: [
        'Bấm "Mở trang web": một bài blog hoàn toàn bằng tiếng Nga.',
        'Chrome/Edge: chuột phải vào trang → "Dịch sang Tiếng Việt" (hoặc biểu tượng dịch trên thanh địa chỉ).',
        'Tìm "từ mã" trong khung trích dẫn của bài.',
      ],
      hashes: ['zn3low', 'c1rhk9', '1dothv7'],
      hint: 'Từ mã là thứ hay xuất hiện trên bầu trời sau cơn mưa 🌈.' },
  ],

  // ---------- TRẠM 3: DỊCH THƯ GỬI BẠN QUỐC TẾ ----------
  desk: {
    friend: 'Emma, 16 tuổi, học sinh lớp 10 ở Sydney (Úc)',
    // Thư mẫu để GV làm mẫu (bản tiếng Anh là ví dụ minh hoạ, kết quả Google Dịch thực tế có thể khác)
    sample: {
      vi: 'Chào Emma,\nMình tên là Minh Anh, năm nay 15 tuổi, đang học lớp 10A3 ở Trường THCS & THPT Hà Thành. Mình rất vui khi được làm quen với bạn. Mình thích chơi cầu lông và nghe nhạc. Môn học mình yêu thích nhất là Tin học vì mình muốn trở thành lập trình viên. Mỗi sáng mình thường ăn phở trước khi đến trường. Còn bạn thì sao? Trường của bạn ở Sydney có gì đặc biệt? Bạn thích môn học nào nhất? Mong sớm nhận được thư của bạn.\nThân mến,\nMinh Anh',
      en: 'Hi Emma,\nMy name is Minh Anh. I am 15 years old and I am in class 10A3 at Ha Thanh Secondary and High School. I am very happy to get to know you. I like playing badminton and listening to music. My favourite subject is Informatics because I want to become a programmer. Every morning I usually eat pho before going to school. What about you? What is special about your school in Sydney? What is your favourite subject? I hope to hear from you soon.\nBest wishes,\nMinh Anh',
    },
    tips: [
      ['Kiểm tra tên riêng', 'Xem máy có giữ đúng tên Emma, Minh Anh và tên trường không.'],
      ['Đọc lại cả câu', 'Nếu một câu tiếng Anh nghe lạ, hãy so ý của câu ấy với thư tiếng Việt.'],
      ['Thử dịch ngược', 'Dịch bản tiếng Anh về tiếng Việt để phát hiện chỗ sai ý.'],
    ],
  },

  // ---------- TRẠM 4: HỌC LIỆU MỞ & GIẤY PHÉP ----------
  oerIntro: [
    ['📖 Học liệu mở là gì?', 'Là tài liệu học tập (bài giảng, video, sách điện tử, bài tập, hình ảnh…) được chia sẻ công khai trên Internet để ai cũng dùng được miễn phí.'],
    ['🏛️ Bắt đầu từ đâu?', 'Năm 2002, Học viện Công nghệ Massachusetts (MIT, Mỹ) đưa toàn bộ bài giảng lên mạng miễn phí. Từ đó nhiều trường, tổ chức trên thế giới làm theo.'],
    ['⚖️ Miễn phí ≠ muốn làm gì cũng được', 'Tác giả gắn cho tài liệu một giấy phép, nói rõ em được làm gì. Phổ biến nhất là giấy phép Creative Commons (CC).'],
  ],
  ccLegend: [
    { code: 'BY', icon: '👤', text: 'Ghi tên tác giả' },
    { code: 'SA', icon: '🔄', text: 'Chia sẻ lại với cùng giấy phép' },
    { code: 'NC', icon: '🚫💰', text: 'Không dùng để kiếm tiền' },
    { code: 'ND', icon: '🚫✂️', text: 'Không được chỉnh sửa' },
    { code: 'CC0', icon: '🎁', text: 'Tặng cộng đồng, dùng tự do' },
  ],
  ccRules: [
    ['1', 'Luôn bắt đầu bằng <b>CC</b>', 'CC = Creative Commons, tên của bộ giấy phép.'],
    ['2', 'Tiếp theo luôn là <b>BY</b>', 'Mọi giấy phép CC đều bắt buộc ghi tên tác giả (trừ CC0).'],
    ['3', '<b>NC</b> (nếu có) đứng ngay sau BY', 'Thêm điều kiện "không dùng để kiếm tiền".'],
    ['4', 'Cuối cùng là <b>SA</b> hoặc <b>ND</b>, không bao giờ có cả hai', 'SA cho phép sửa rồi chia sẻ lại, ND cấm sửa: hai điều này ngược nhau.'],
  ],
  ccList: [
    ['CC0', 'Tặng cộng đồng, không cần xin phép'],
    ['CC BY', 'Ghi tên tác giả'],
    ['CC BY-SA', 'Ghi tên + chia sẻ lại cùng giấy phép'],
    ['CC BY-NC', 'Ghi tên + không kiếm tiền'],
    ['CC BY-NC-SA', 'Ghi tên + không kiếm tiền + chia sẻ lại cùng giấy phép'],
    ['CC BY-ND', 'Ghi tên + không được sửa'],
    ['CC BY-NC-ND', 'Ghi tên + không kiếm tiền + không được sửa (chặt nhất)'],
  ],
  ccOrder: [
    { tag: 'CC BY-NC-SA', a: true, why: 'Đúng thứ tự: CC → BY → NC → SA.' },
    { tag: 'CC SA-BY', a: false, why: 'BY phải đứng ngay sau CC. Viết đúng là CC BY-SA.' },
    { tag: 'CC BY-SA-ND', a: false, why: 'Không bao giờ có cả SA và ND vì hai điều kiện này ngược nhau.' },
    { tag: 'CC NC-BY', a: false, why: 'NC phải đứng sau BY. Viết đúng là CC BY-NC.' },
  ],
  ccExample: 'Các kí hiệu ghép với nhau. Ví dụ CC BY-NC-SA = phải ghi tên tác giả + không dùng để kiếm tiền + chia sẻ lại với cùng giấy phép.',
  // "Bảo lưu mọi quyền" (All rights reserved) KHÔNG phải giấy phép CC — đây là quyền tác giả mặc định
  // khi không ai cấp phép gì cả, ngược hẳn với CC0 (tặng tự do). Giải thích riêng để không lẫn với 5 kí hiệu CC.
  arr: { icon: '©️', text: 'Bảo lưu mọi quyền — không phải một kiểu giấy phép CC, mà là mặc định khi tác giả KHÔNG cấp phép gì cả (ví dụ nhiều video, bài hát, bài báo). Người xem chỉ được xem/nghe; muốn tải về, đăng lại, chỉnh sửa hay chia sẻ đều phải xin phép tác giả trước. Đây là đầu ngược lại với CC0 (cho dùng tự do).' },
  lic: [
    { sit: 'Em đưa một bức ảnh vào bài thuyết trình trên lớp và ghi tên tác giả ngay dưới ảnh.', tag: 'CC BY', a: true,
      why: 'CC BY cho phép dùng mọi mục đích, chỉ cần ghi tên tác giả. Em đã làm đúng.' },
    { sit: 'Em dùng một video để làm quảng cáo bán hàng trực tuyến cho cửa hàng của gia đình.', tag: 'CC BY-NC', a: false,
      why: 'NC = phi thương mại. Quảng cáo bán hàng là mục đích kiếm tiền nên không được.' },
    { sit: 'Em cắt ghép một bức ảnh, thêm chữ lên ảnh rồi đăng ảnh đã sửa lên mạng xã hội.', tag: 'CC BY-ND', a: false,
      why: 'ND = không được chỉnh sửa. Cắt ghép, thêm chữ là tạo tác phẩm phái sinh.' },
    { sit: 'Em in một bảng tuần hoàn từ Internet để phát cho cả lớp ôn bài.', tag: 'CC0', a: true,
      why: 'CC0 là tặng cộng đồng, dùng tự do. Ghi nguồn vẫn là thói quen tốt.' },
    { sit: 'Em tải video bài giảng của người khác về rồi đăng nguyên video ấy lên kênh YouTube của mình, khi chưa hỏi tác giả.', tag: '© Bảo lưu mọi quyền', a: false,
      why: 'Bảo lưu mọi quyền nghĩa là chỉ được xem. Đăng lại cần tác giả cho phép.' },
    { sit: 'Em dịch một chương sách sang tiếng Việt, ghi tên tác giả và nguồn gốc, rồi chia sẻ bản dịch miễn phí cho bạn bè.', tag: 'CC BY', a: true,
      why: 'CC BY cho phép dịch, chỉnh sửa và chia sẻ, miễn là ghi tên tác giả gốc.' },
    { sit: 'Em sửa một bài viết của người khác rồi đăng lên blog cá nhân với dòng "Cấm mọi hình thức sao chép", dù bài gốc yêu cầu chia sẻ lại cùng giấy phép.', tag: 'CC BY-SA', a: false,
      why: 'SA = chia sẻ tương tự. Bản sửa phải dùng cùng giấy phép mở, không được "khoá" lại.' },
  ],

  // ---------- TRẠM 5: SĂN HỌC LIỆU MỞ (tự tìm trên Google) ----------
  topics: [
    { no: 1, icon: '💻', subject: 'Tin học 10', title: 'Hệ nhị phân', kw: 'Hệ nhị phân Tin học 10' },
    { no: 2, icon: '🌿', subject: 'Sinh học', title: 'Quang hợp ở thực vật', kw: 'Quang hợp ở thực vật' },
    { no: 3, icon: '🏛️', subject: 'Lịch sử', title: 'Chiến dịch Điện Biên Phủ 1954', kw: 'Chiến dịch Điện Biên Phủ 1954' },
    { no: 4, icon: '🗺️', subject: 'Địa lí', title: 'Vịnh Hạ Long', kw: 'Vịnh Hạ Long' },
    { no: 5, icon: '📖', subject: 'Ngữ văn', title: 'Truyện Kiều – Nguyễn Du', kw: 'Truyện Kiều Nguyễn Du' },
    { no: 6, icon: '🍎', subject: 'Vật lí 10', title: 'Ba định luật Newton', kw: 'Ba định luật Newton Vật lí 10' },
    { no: 7, icon: '➗', subject: 'Toán 10', title: 'Hàm số bậc hai', kw: 'Hàm số bậc hai Toán 10' },
    { no: 8, icon: '🧪', subject: 'Hoá học 10', title: 'Bảng tuần hoàn các nguyên tố hoá học', kw: 'Bảng tuần hoàn các nguyên tố hoá học' },
  ],
  searchSuffix: 'học liệu mở',
  goodSigns: [
    'Trang của trường học, sở/bộ giáo dục (đuôi .edu.vn, .gov.vn), nhà xuất bản (nxbgd.vn, hoclieu.vn)',
    'Bách khoa toàn thư mở (Wikipedia), kho ảnh mở (Wikimedia Commons)',
    'Ghi rõ tác giả hoặc đơn vị, có thông tin giấy phép hoặc bản quyền',
  ],
  badSigns: [
    'Nhiều quảng cáo, bắt tải phần mềm lạ hoặc nhập mật khẩu',
    'Không rõ ai viết, không có ngày đăng',
  ],

  // ---------- VỀ ĐÍCH ----------
  exit: [
    { q: 'Ở nhà người quen, em cần đọc bảng hướng dẫn tiếng Nhật dán trên máy giặt. Cách nhanh nhất là gì?',
      o: ['Gõ từng chữ Nhật vào Google Dịch', 'Dùng camera dịch (Google Dịch / Google Lens) hướng vào bảng', 'Tìm tệp PDF hướng dẫn rồi dịch tài liệu', 'Nhờ người lạ trên mạng dịch giúp'], a: 1,
      e: 'Chữ in trên đồ vật, không gõ được → camera dịch là nhanh nhất.' },
    { q: 'Em dịch lời nhắn sang tiếng Anh. Cách tự kiểm tra xem bản dịch có giữ đúng ý không là gì?',
      o: ['Tin hoàn toàn vì máy dịch dùng AI', 'Đếm số từ của hai bản', 'Dịch ngược về tiếng Việt rồi so với câu gốc', 'Đổi phông chữ cho dễ đọc'], a: 2,
      e: 'Dịch ngược giúp phát hiện chỗ bị lệch ý.' },
    { q: 'Bài luận tiếng Anh nộp cô giáo, cách dùng công cụ dịch nào là trung thực và giúp em tiến bộ?',
      o: ['Tự viết, dùng công cụ để tra từ, nghe phát âm, kiểm tra rồi tự sửa', 'Viết tiếng Việt, dịch máy rồi nộp nguyên bản dịch', 'Chép bài mẫu trên mạng rồi dịch', 'Nhờ bạn viết hộ'], a: 0,
      e: 'Công cụ dịch là trợ lí học tập. Nộp nguyên bản dịch máy là thiếu trung thực.' },
    { q: 'Em tìm được vài trang để ôn bài. Dấu hiệu nào giúp em chọn một trang học liệu đáng tin hơn?',
      o: ['Có nhiều quảng cáo nhấp nháy', 'Ghi rõ tác giả hoặc tổ chức uy tín, có ngày cập nhật', 'Tiêu đề viết HOA toàn bộ', 'Được chia sẻ nhiều trên mạng xã hội'], a: 1,
      e: 'Kiểm tra: ai làm ra, cập nhật khi nào, thuộc tổ chức nào.' },
    { q: 'Em muốn dùng một bức ảnh có giấy phép CC BY-NC trên áp phích quảng cáo bán bánh của cửa hàng gia đình. Em nên làm gì?',
      o: ['Dùng luôn, vì ảnh miễn phí', 'Dùng và xoá tên tác giả', 'Chọn ảnh khác có giấy phép phù hợp (CC BY, CC0) hoặc xin phép tác giả', 'Chụp màn hình ảnh để "lách" giấy phép'], a: 2,
      e: 'NC không cho dùng vào việc có thu tiền. Hãy chọn ảnh khác hoặc xin phép.' },
    { q: 'Một trang web hứa "tải miễn phí bộ đề thi" nhưng bắt nhập mật khẩu email. Em làm gì?',
      o: ['Nhập mật khẩu để tải cho nhanh', 'Không nhập, rời trang và tìm trong kho học liệu uy tín', 'Nhập mật khẩu của bạn khác', 'Gửi đường link cho cả lớp cùng tải'], a: 1,
      e: 'Không bao giờ nhập mật khẩu để "tải tài liệu" (nhớ Bài 9). Học liệu mở thật không đòi mật khẩu email.' },
  ],
};
