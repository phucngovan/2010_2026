/* ============================================================
   CHỈNH SỬA NỘI DUNG Ở ĐÂY 💖
   Chỉ cần sửa file này, không cần đụng vào file khác.
   ============================================================ */
window.CONFIG = {
  // Tên gọi vợ (hiện ở màn hình mở thư)
  wifeName: "vợ yêu",

  // Ký tên cuối thư
  signature: "Chồng của em",

  // Ngày bắt đầu bên nhau (yêu nhau hoặc ngày cưới) — định dạng NĂM-THÁNG-NGÀY
  startDate: "2022-10-21",
  // Nhãn hiển thị cho mốc ngày ở trên
  startLabel: "kể từ ngày đầu tiên",

  // Nhạc nền (tuỳ chọn). Bỏ file mp3 vào thư mục assets rồi ghi: "assets/music.mp3"
  music: "",

  // Hành trình của mình — mỗi mục là một chặng, xếp theo thứ tự thời gian.
  // photos: ghi đường dẫn ảnh; thêm wide: true cho ảnh ngang (chiếm cả hàng),
  // pos: "50% 30%" để chỉnh phần ảnh được giữ lại khi bị cắt khung.
  timeline: [
    {
      icon: "💌", tag: "21 · 10 · 2022", title: "Ngày đầu tiên",
      text: "Ngày mình chính thức nắm tay nhau. Từ hôm ấy, mỗi ngày của anh đều có em.",
      photos: [{ src: "assets/photos/3.jpg", pos: "50% 35%" }]
    },
    {
      icon: "☕", tag: "Những ngày mới yêu", title: "Hẹn hò",
      text: "Những buổi tối cà phê, những tấm selfie chụp hoài không chán — anh chỉ mải ngắm em thôi.",
      photos: [
        { src: "assets/photos/11.jpg", wide: true, pos: "50% 30%" },
        { src: "assets/photos/5.jpg", pos: "50% 30%" },
        { src: "assets/photos/4.jpg", pos: "50% 40%" }
      ]
    },
    {
      icon: "⛰️", tag: "Sa Pa", title: "Mây núi Sa Pa",
      text: "Gió lạnh, mây vờn đỉnh núi, và em đứng cạnh anh — vậy là đủ ấm rồi.",
      photos: [{ src: "assets/photos/13.jpg", wide: true, pos: "50% 60%" }]
    },
    {
      icon: "💍", tag: "Đêm pháo hoa", title: "Chiếc nhẫn & lời hứa",
      text: "Bầu trời rực sáng, nhưng thứ lấp lánh nhất đêm ấy là chiếc nhẫn trên tay em.",
      photos: [{ src: "assets/photos/14.jpg", pos: "50% 45%" }]
    },
    {
      icon: "🏮", tag: "Hội An", title: "Phố cổ & đèn lồng",
      text: "Hoa giấy, đèn lồng, Chùa Cầu lung linh về đêm — đi đâu anh cũng chỉ muốn nắm tay em.",
      photos: [
        { src: "assets/photos/10.jpg", wide: true, pos: "55% 50%" },
        { src: "assets/photos/9.jpg", pos: "50% 72%" },
        { src: "assets/photos/12.jpg", pos: "50% 60%" }
      ]
    },
    {
      icon: "🏝️", tag: "Phú Quốc", title: "Biển xanh, nắng vàng",
      text: "Võng đung đưa, sóng vỗ rì rào, và cô gái anh yêu cười tươi hơn cả nắng.",
      photos: [
        { src: "assets/photos/15.jpg", wide: true, pos: "50% 60%" },
        { src: "assets/photos/17.jpg", pos: "50% 62%" },
        { src: "assets/photos/18.jpg", pos: "65% 50%" }
      ]
    },
    {
      icon: "👰", tag: "Ngày cưới", title: "Về chung một nhà",
      text: "Ngày em khoác lên mình váy cưới, anh biết mình là người may mắn nhất thế gian.",
      photos: [
        { src: "assets/photos/1.jpg", wide: true, pos: "50% 35%" },
        { src: "assets/photos/2.jpg", wide: true, pos: "40% 30%" }
      ]
    },
    {
      icon: "⛵", tag: "Mỗi ngày bên nhau", title: "Vẫn hẹn hò như ngày đầu",
      text: "Thời gian trôi, mình vẫn cùng nhau đi khắp nơi, vẫn cười tít mắt như hồi mới yêu.",
      photos: [
        { src: "assets/photos/20.jpg", pos: "50% 55%" },
        { src: "assets/photos/19.jpg", pos: "50% 25%" }
      ]
    },
    {
      icon: "👶", tag: "Nhà mình có thêm thành viên", title: "Thiên thần nhỏ",
      text: "Rồi nhà mình có thêm một thiên thần nhỏ. Cảm ơn em đã vất vả mang con đến với thế giới này — em là người mẹ tuyệt vời nhất.",
      photos: [
        { src: "assets/photos/22.jpg", pos: "50% 30%" },
        { src: "assets/photos/23.jpg", pos: "50% 45%" }
      ]
    }
  ],

  // Ảnh trong khung vuốt "Khoảnh khắc của mình".
  // Để src trống thì sẽ hiện khung trang trí thay cho ảnh. pos: giống ở trên.
  photos: [
    { src: "assets/photos/7.jpg", pos: "62% 50%", caption: "Thơm má em một cái 😘" },
    { src: "assets/photos/6.jpg", pos: "45% 70%", caption: "Giữa cánh đồng chỉ có hai mình" },
    { src: "assets/photos/8.jpg", pos: "50% 60%", caption: "Lạc giữa phố đèn lồng" },
    { src: "assets/photos/16.jpg", pos: "62% 50%", caption: "Anh selfie, em ngắm hoàng hôn 😆" },
    { src: "assets/photos/21.jpg", pos: "50% 62%", caption: "Bắn tim cho em nè 💕" }
  ],

  // Dòng chữ chạy ở màn hình chính
  typed: [
    "Chúc mừng ngày Phụ nữ Việt Nam 💐",
    "Gửi người phụ nữ anh yêu nhất",
    "Cảm ơn em vì đã luôn ở bên anh",
    "Hôm nay là ngày của em 👑"
  ],

  // Lời chúc
  wishes: [
    { icon: "🌸", title: "Luôn xinh đẹp", text: "Mãi rạng rỡ, mãi tươi tắn như đóa hoa đẹp nhất của anh." },
    { icon: "💪", title: "Thật nhiều sức khỏe", text: "Để mỗi sáng thức dậy em đều thấy nhẹ nhàng và tràn năng lượng." },
    { icon: "😊", title: "Luôn vui vẻ", text: "Nụ cười của em là điều anh muốn giữ gìn nhất trên đời." },
    { icon: "✨", title: "Mọi điều như ý", text: "Công việc suôn sẻ, ước mơ nào của em cũng thành hiện thực." },
    { icon: "👑", title: "Mãi là công chúa", text: "Dù bao năm trôi qua, em vẫn luôn là cô gái nhỏ được anh chiều chuộng." },
    { icon: "💞", title: "Hạnh phúc trọn vẹn", text: "Mình cùng nhau đi hết quãng đường dài, tay vẫn nắm chặt tay." }
  ],

  // Lá thư — mỗi dòng là một đoạn
  letter: [
    "Hôm nay là 20/10, anh muốn dành riêng một góc nhỏ trên thế giới này chỉ để nói với em vài điều.",
    "Cảm ơn em vì đã chọn anh, đã kiên nhẫn với anh, và đã biến những ngày bình thường thành những ngày thật đặc biệt.",
    "Có em, căn nhà mới thật sự là nhà. Có em, mọi mệt mỏi ngoài kia đều trở nên nhỏ bé.",
    "Cảm ơn em đã cho anh được làm bố. Nhìn em chăm con từng chút một, anh thương em nhiều hơn mỗi ngày.",
    "Anh không giỏi nói lời hoa mỹ, nhưng anh hứa sẽ luôn yêu thương, che chở và làm em cười mỗi ngày.",
    "Chúc vợ yêu của anh một ngày 20/10 thật hạnh phúc. Anh yêu em nhiều lắm! ❤"
  ],

  // Câu hiện ra mỗi lần em bấm nút ở cuối trang
  loveLines: [
    "Anh yêu em! 💖",
    "Yêu em nhiều lắm luôn 🥰",
    "Em là nhất! 👑",
    "Thương vợ nhất trên đời 💕",
    "Mãi bên nhau nhé 💞",
    "Em là cả thế giới của anh 🌍",
    "Vợ anh xinh nhất 🌸",
    "Yêu em hơn hôm qua 💗"
  ]
};
