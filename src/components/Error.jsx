export default function Error({ message }) {
  return (
    <div className="mx-auto mb-8 max-w-[98%] w-full">
      <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-red-600 p-1"></div>
        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-red-800 mb-3 flex items-center justify-center gap-2">
                <span>Oops! Đã xảy ra lỗi</span>
              </h3>
              <p className="text-sm mb-4 md:text-base">
                Vui lòng kiểm tra kết nối internet hoặc thử lại sau ít phút.
              </p>
              <p className="text-red-700 text-base md:text-lg leading-relaxed mb-2">
                Message: <b>{message}</b>
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors text-base font-bold shadow-md"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Tải lại trang</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
