export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Về FChoice 2025 Tracker
        </h1>
      </div>

      <div className="space-y-6">
        {/* Giới thiệu */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Giới thiệu</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-2">
            FChoice 2025 Tracker là công cụ theo dõi và phân tích kết quả bình
            chọn của FChoice 2025 theo thời gian thực. Đồng thời cung cấp các
            tính năng thống kê, dự đoán và cập nhật trực tiếp giúp bạn nắm bắt
            một cách trực quan về xu hướng bình chọn.
          </p>
          <h3 className="text-lg font-extrabold hover:underline">
            <a href="https://fchoice.vn/">
              Truy cập trang web giải thưởng: <b>fchoice.vn</b>
            </a>
          </h3>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cách hoạt động */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Cách thức hoạt động{" "}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-2">
            Hệ thống lấy dữ liệu thông qua API của hệ thống bình chọn, sau đó xử
            lý và hiển thị dưới dạng bảng xếp hạng, biểu đồ và phân tích dự
            đoán. Dữ liệu được cập nhật liên tục để đảm bảo tính chính xác và
            kịp thời.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              {" "}
              Dữ liệu thời gian thực được cập nhật trực tiếp mỗi <b>10 giây</b>.
            </li>
            <li>
              {" "}
              Dữ liệu thống kê và dự đoán được ghi nhận mỗi <b>10 phút</b>. Từ
              đó tổng hợp lại để đưa ra các phân tích và dự đoán.
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        {/* Source code */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Mã nguồn của dự án{" "}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-2">
            Mã nguồn dự án được sẽ công khai sau khi kết thúc bình chọn.
          </p>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          Hướng dẫn sử dụng
        </h1>
      </div>

      <div className="space-y-10 mb-12">
        {/* Trang Cập nhật */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Tính năng: Cập nhật thời gian thực (Realtime)
            </h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Mục đích:</strong> Hiển thị bảng xếp hạng các ứng viên
              theo thời gian thực (10 giây một lần).
            </p>
            <p>
              <strong>Cách hoạt động:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dữ liệu được cập nhật tự động mỗi 10 giây</li>
              <li>
                Hiển thị tổng số phiếu bình chọn của từng ứng viên theo từng
                hạng mục, được sắp xếp theo thứ hạng.
              </li>
              <li>
                Cột "Thay đổi" cho biết số phiếu tăng/giảm so với lần cập nhật
                trước:
                <ul className="list-circle list-inside ml-6 mt-1">
                  <li>
                    <b className="text-green-700">Màu xanh lá (↑):</b> Số phiếu
                    tăng
                  </li>
                  <li>
                    <b className="text-red-700">Màu đỏ (↓):</b> Số phiếu giảm
                  </li>
                  <li>Màu xám (0): Không có thay đổi</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Trang Thống kê */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Tính năng: Thống kê (Stats)
            </h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Mục đích:</strong> Phân tích xu hướng bình chọn qua các
              mốc thời gian.
            </p>
            <p>
              <strong>Cách sử dụng:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chọn hạng mục muốn xem thống kê.</li>
              <li>
                Hệ thống sẽ hiển thị Lịch sử bình chọn và Biểu đồ bình chọn.
              </li>
            </ul>
            <p>
              <strong>Lịch sử bình chọn:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Hiển thị tất cả các bản ghi (tức số bình chọn của từng ứng viên
                được hệ thống ghi nhận trong lịch sử), cùng với đó là chênh lệch
                số bình chọn so với bản ghi gần nhất trước đó.
              </li>

              <li>
                Có thể lọc bản ghi theo các tiêu chí:
                <ul className="list-circle list-inside ml-6 mt-1">
                  <li>
                    <b>Thời gian giữa hai bản ghi:</b> Ví dụ chỉ lấy các bản ghi
                    cách nhau 30 phút, 1 tiếng,... Mặc định (không lọc) là 10
                    phút.
                  </li>
                  <li>
                    <b>Ngày bắt đầu lấy bản ghi:</b> Ví dụ chỉ lấy các bản ghi
                    từ ngày 3/6/2025.
                  </li>
                </ul>
              </li>
            </ul>

            <p>
              <strong>Biểu đồ bình chọn: </strong>
              Có 2 loại là Biểu đồ tổng số phiếu, hiển thị sự thay đổi tổng số
              phiếu; và Biểu đồ tốc độ tăng trưởng, hiển thị sự thay đổi về tốc
              độ tăng trưởng (đơn vị: số phiếu/phút).
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Theo dõi giá trị tại mốc cụ thể:</strong> Di chuột vào
                biểu đồ tại một điểm bất kỳ để xem chi tiết số phiếu hoặc tốc độ
                tại mốc thời gian đó. Chỉ áp dụng trên máy tính, laptop.
              </li>
              <li>
                <strong>Thu phóng đồ thị:</strong> Dùng lăn chuột trên máy tính,
                hoặc vuốt 2 ngón trên điện thoại để thu phóng biểu đồ, giúp quan
                sát chi tiết hơn.
              </li>
              <li>
                <strong>Kéo đồ thị:</strong> Nhấn giữ và kéo biểu đồ trên máy
                tính, hoặc dùng 1 ngón tay trên điện thoại để di chuyển biểu đồ
                sang trái/phải theo trục thời gian.
              </li>
              <li>
                <strong>Đặt lại thu phóng:</strong> Nhấn vào nút "Đặt lại thu
                phóng" để đồ thị về trạng thái ban đầu.
              </li>
            </ul>
          </div>
        </div>

        {/* Trang Dự đoán */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Tính năng: Dự đoán (Prediction)
            </h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Mục đích:</strong> Ước tính thời gian cần thiết để một ứng
              viên bắt kịp người dẫn đầu.
            </p>
            <p>
              <strong>Thuật toán được sử dụng:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Tính tốc độ tăng trưởng trung bình, thông qua 2 mốc thời gian:
                của bản ghi gần nhất và bản ghi cách đó khoảng thời gian tùy
                chọn.
              </li>
              <li>
                So sánh tốc độ tăng trưởng và kết luận, đồng thời ước tính thời
                gian "bắt kịp" dựa trên tốc độ tăng tưởng trung bình.
              </li>
            </ul>
            <p>
              <strong>Cách sử dụng:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chọn hạng mục</li>
              <li>Chọn ứng viên muốn theo dõi</li>
              <li>
                Chọn khoảng thời gian giữa hai mốc để phân tích tốc độ. Mặc định
                là 10 phút
              </li>
            </ul>
            <p>
              <strong>Thông tin hiển thị:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Tổng bình chọn:</strong> Số phiếu hiện tại của từng ứng
                viên
              </li>
              <li>
                <strong>Tốc độ tăng:</strong> Số phiếu tăng mỗi phút (dựa trên
                khoảng thời gian phân tích)
              </li>
              <li>
                <strong>Chênh lệch số phiếu:</strong> Khoảng cách giữa ứng viên
                đang theo dõi và người dẫn đầu
              </li>
              <li>
                <strong>Chênh lệch tốc độ:</strong> Sự khác biệt về tốc độ tăng
                trưởng
              </li>
              <li>
                <strong>Có thể bắt kịp?:</strong> Đánh giá khả năng vượt lên dựa
                trên tốc độ hiện tại
              </li>
              <li>
                <strong>Thời gian ước tính:</strong> Nếu có thể bắt kịp, tính
                toán thời gian dự kiến
              </li>
            </ul>
            <div className="bg-gray-100 rounded-lg p-4 mt-4">
              <p className="text-sm">
                <strong>Lưu ý:</strong> Dự đoán chỉ mang tính chất tham khảo,
                dựa trên xu hướng hiện tại và quá khứ. Kết quả thực tế có thể
                thay đổi do ảnh hưởng của nhiều yếu tố như mức độ "điêng" của
                cộng đồng, "Góc lạm quyền",...
              </p>
            </div>
          </div>
        </div>

        {/* Mẹo sử dụng */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Mẹo sử dụng hiệu quả</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className=" font-bold">1.</span>
              <span>
                <strong>Theo dõi thường xuyên:</strong> Tình hình bình chọn có
                thể thay đổi nhanh, hãy kiểm tra định kỳ để cập nhật thông tin
                mới nhất, từ đó hãy kêu gọi cộng đồng "giải cứu".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>
                <strong>Kết hợp các trang:</strong> Xem trang Cập nhật để biết
                thứ hạng hiện tại, sau đó dùng trang Thống kê để phân tích xu
                hướng, và trang Dự đoán để ước tính khả năng vượt lên.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>
                <strong>Chọn khoảng thời gian phù hợp:</strong> Khoảng thời gian
                ngắn (5-10 phút) phản ánh xu hướng tức thì, khoảng thời gian dài
                (30-60 phút) cho xu hướng dài hạn hơn.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>
                <strong>So sánh nhiều ứng viên:</strong> Ở trang Thống kê, chọn
                nhiều ứng viên cùng lúc để dễ dàng so sánh xu hướng.
              </span>
            </li>
          </ul>
        </div>
        {/* Câu hỏi thường gặp */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Câu hỏi thường gặp (FAQ)
          </h1>
        </div>
        <div className="space-y-10 mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">
                  Q: Đây có phải là công cụ gian lận (tool hack/cheat) không?
                </h3>
                <p className="text-gray-700 ml-4">
                  A: Đây là trang web cung cấp dữ liệu và phân tích dựa trên
                  thông tin công khai từ hệ thống bình chọn. Dữ liệu được lấy
                  thông qua API công khai của hệ thống bình chọn. Trang web {}
                  <b>KHÔNG</b> can thiệp hay thay đổi trái phép bất kỳ kết quả
                  bình chọn nào.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  Q: Dữ liệu được cập nhật bao lâu một lần?
                </h3>
                <p className="text-gray-700 ml-4">
                  A: Trang "Cập nhật" được cập nhật liên tục 10 giây một lần.
                  Các trang khác (Thống kê, Dự đoán) được cập nhật 10 phút một
                  bản ghi vào cơ sở dữ liệu, bạn có thể lựa chọn lọc bản ghi nếu
                  muốn.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  Q: Tại sao dự đoán có thể không chính xác?
                </h3>
                <p className="text-gray-700 ml-4">
                  A: Dự đoán dựa trên xu hướng hiện tại và giả định rằng tốc độ
                  bình chọn sẽ giữ nguyên. Trong thực tế, tốc độ có thể thay đổi
                  do nhiều yếu tố.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  Q: Làm sao để xem chi tiết một ứng viên cụ thể?
                </h3>
                <p className="text-gray-700 ml-4">
                  A: Vào trang Thống kê hoặc Dự đoán, chọn hạng mục và ứng viên
                  muốn xem. Bạn sẽ thấy thông tin chi tiết về xu hướng bình chọn
                  của họ.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  Q: Ứng viên được highlight (nền màu) có ý nghĩa gì?
                </h3>
                <p className="text-gray-700 ml-4">
                  A: Đây là các ứng viên được cộng đồng chúng tôi ưu tiên theo
                  dõi, giúp dễ dàng nhận diện trong bảng xếp hạng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
