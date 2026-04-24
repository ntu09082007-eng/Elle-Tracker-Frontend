export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 mt-auto w-full border-t border-gray-200 shadow-lg">
      <div className="w-full px-8 md:px-16 lg:px-24 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 auto-cols-min gap-y-6 max-w-6xl mx-auto">
          {/* About Section */}
          <div className="xl:col-span-3">
            <h3 className="text-2xl font-extrabold mb-1 text-black">
              FChoice 2025 Tracker
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              Hệ thống theo dõi và phân tích bình chọn cho giải thưởng FChoice
              2025 của Cafef.vn.
            </p>
            <h3 className="text-gray-800 text-sm font-extrabold hover:underline">
              <a href="https://fchoice.vn/">Truy cập trang web giải thưởng</a>
            </h3>
          </div>

          {/* Info */}
          <div className="xl:col-span-2">
            <h3 className="text-black text-xl font-bold mb-1">Thông tin</h3>
            <p className="text-sm leading-relaxed">
              Dữ liệu được cập nhật trực tiếp từ hệ thống định kỳ mỗi{" "}
              <b>10 giây</b>.
              <br />
              Đồng thời ghi nhận lại mỗi <b>10 phút</b> để phân tích và dự đoán.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6 text-center mb-2 border-gray-400">
          <p className="text-gray-800 text-sm mb-1 ">
            © Bản quyền giải thưởng thuộc về Cafef.vn & công ty cổ phần VCCorp.
            <br />
            Phát triển độc lập bởi người hâm mộ chương trình ATVNCG.
          </p>
          <p className="text-lg font-bold text-black">#camonvidaden</p>
        </div>
      </div>
    </footer>
  );
}
