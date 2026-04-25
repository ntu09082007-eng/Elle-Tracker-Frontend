export default function Footer() {
  return (
    <footer className="w-full bg-[#f1f3f5] py-8 px-10 md:px-20 lg:px-32 mt-auto">
      {/* 🛠 Dùng max-w-7xl và py-8 để footer thấp xuống và bao vừa đủ content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* CỘT TRÁI: Logo & Link (Giảm space-y xuống 2 để khít hơn) */}
        <div className="space-y-2">
          <h3 className="text-[24px] font-[900] text-black uppercase tracking-tighter leading-none">
            Elle Tracker
          </h3>
          <p className="text-[14px] text-neutral-500 font-medium">
            Hệ thống theo dõi và phân tích bình chọn cho giải thưởng Elle Beauty Awards 2026.
          </p>
          <a
            href="https://events.elle.vn/elle-beauty-awards-2026/nhan-vat"
            target="_blank"
            rel="noreferrer"
            className="text-black font-[900] text-[14px] hover:underline inline-block"
          >
            Truy cập trang web giải thưởng
          </a>
        </div>

        {/* CỘT PHẢI: Bản quyền (Giữ căn lề trái như turn trước) */}
        <div className="text-[14px] text-neutral-600 font-medium space-y-0.5 text-left">
          <p className="whitespace-nowrap">
            © All rights reserved by Elle Beauty Awards.
          </p>
          <p className="whitespace-nowrap">
            Phát triển độc lập bởi người hâm mộ nghệ sĩ LYHAN.
          </p>
        </div>

      </div>
    </footer>
  );
}
