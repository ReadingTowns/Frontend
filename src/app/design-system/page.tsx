export default function DesignSystem() {
  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary-200 to-secondary-800 bg-clip-text text-transparent">
          리딩 타운 디자인시스템
        </h1>
        <p className="text-center text-gray-500 mt-2">
          UI 컴포넌트 및 스타일 가이드
        </p>
      </header>

      {/* Design System Demo */}
      <div className="space-y-8">
        {/* Color Palette */}
        <section>
          <h2 className="text-xl font-semibold mb-4">컬러 팔레트</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Primary</p>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded bg-primary-100"></div>
                <div className="w-8 h-8 rounded bg-primary-200"></div>
                <div className="w-8 h-8 rounded bg-primary-300"></div>
                <div className="w-8 h-8 rounded bg-primary-400"></div>
                <div className="w-8 h-8 rounded bg-primary-500"></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Secondary</p>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded bg-secondary-100"></div>
                <div className="w-8 h-8 rounded bg-secondary-200"></div>
                <div className="w-8 h-8 rounded bg-secondary-300"></div>
                <div className="w-8 h-8 rounded bg-secondary-400"></div>
                <div className="w-8 h-8 rounded bg-secondary-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold mb-4">버튼</h2>
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 px-4 bg-primary-400 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors">
              Primary 버튼
            </button>
            <button className="w-full py-3 px-4 bg-secondary-200 hover:bg-secondary-300 text-gray-800 rounded-lg font-medium transition-colors">
              Secondary 버튼
            </button>
            <button className="w-full py-3 px-4 border-2 border-primary-400 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
              Outline 버튼
            </button>
            <button className="w-full py-3 px-4 text-primary-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Ghost 버튼
            </button>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">카드</h2>
          <div className="space-y-4">
            {/* Book Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-16 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">책 제목</h3>
                  <p className="text-sm text-gray-600">저자명</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      교환가능
                    </span>
                    <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                      우리동네
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">사용자명</h4>
                  <p className="text-sm text-gray-500">책 12권 · 리뷰 8개</p>
                </div>
                <button className="text-primary-600 text-sm font-medium">
                  팔로우
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Status Messages */}
        <section>
          <h2 className="text-xl font-semibold mb-4">상태 메시지</h2>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              ✓ 책 교환이 완료되었습니다
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              ℹ 새로운 추천 도서가 있습니다
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
              ⚠ 반납 기한이 3일 남았습니다
            </div>
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ✕ 입력한 정보를 확인해주세요
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-xl font-semibold mb-4">폼 요소</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                텍스트 입력
              </label>
              <input
                type="text"
                placeholder="책 제목을 입력하세요"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                텍스트 영역
              </label>
              <textarea
                placeholder="책 소감을 작성해주세요"
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}