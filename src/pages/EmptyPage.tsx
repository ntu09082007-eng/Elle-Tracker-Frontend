export default function EmptyPage() {
  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-10 text-center mt-20 ">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Trang không tồn tại hoặc đã bị xóa!
        </h1>
        <p className="text-gray-600 text-xl">
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
      </div>
      <div className="text-center mt-12 text-lg">
        <a
          href="/realtime"
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300 shadow-lg"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
