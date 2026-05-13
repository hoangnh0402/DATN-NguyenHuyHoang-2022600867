# Đồ án Smart City: HQC System + SmartCity-Platform

Repository này gom **2 dự án độc lập** nhưng cùng chủ đề nền tảng đô thị thông minh:

- `HQC_System`: Nền tảng Smart City theo hướng **Linked Open Data (NGSI-LD, RDF/SPARQL)**.
- `SmartCity-Platform`: Nền tảng xử lý dữ liệu IoT theo hướng **ML classification + tiered storage (HOT/WARM/COLD)**.

## 1. Mục tiêu tổng

Bộ mã nguồn phục vụ nghiên cứu và triển khai các mô hình Smart City từ 2 góc tiếp cận bổ sung cho nhau:

- Chuẩn hóa, liên kết và khai thác dữ liệu mở đô thị (HQC System).
- Thu thập, phân loại và lưu trữ dữ liệu cảm biến thời gian thực ở quy mô lớn (SmartCity-Platform).

## 2. Cấu trúc thư mục

```text
DATN-NguyenHuyHoang-2022600867/
├── HQC_System/
│   ├── backend/             # FastAPI backend (LOD, NGSI-LD, tích hợp đa nguồn)
│   ├── backend-spring/      # Spring Boot domain modules
│   ├── web-dashboard/       # Next.js dashboard quản trị
│   ├── web-app/             # React Native + Expo app cho công dân
│   ├── packages/            # Các npm package (utils, geo-utils, ngsi-ld)
│   └── docs/
├── SmartCity-Platform/
│   ├── backend/             # Spring Boot backend ingest/pull dữ liệu
│   ├── ml-service/          # FastAPI ML service (IsolationForest)
│   ├── frontend/            # Nuxt 3 dashboard
│   ├── consumer-worker/     # Worker tiêu thụ/xử lý dữ liệu
│   ├── python-data-simulator/ # Mô phỏng dữ liệu IoT
│   └── docs/
└── README.md
```

## 3. Tóm tắt nhanh từng dự án

### 3.1 HQC_System

Trọng tâm:

- Mô hình dữ liệu đô thị theo chuẩn mở: **NGSI-LD, SOSA/SSN, GeoSPARQL**.
- Tích hợp dữ liệu từ nhiều nguồn (OSM, thời tiết, chất lượng không khí, giao thông, phản ánh công dân).
- Hỗ trợ truy vấn liên kết dữ liệu và khai thác tri thức qua LOD/RDF.

Thành phần chính:

- Backend FastAPI + PostgreSQL/PostGIS + MongoDB + Redis + GraphDB.
- Dashboard web (Next.js) cho quản trị và giám sát.
- Ứng dụng mobile/web (React Native + Expo) cho người dùng cuối.

Tài liệu chi tiết:

- `HQC_System/README.md`
- `HQC_System/backend/README.md`
- `HQC_System/web-dashboard/README.md`
- `HQC_System/web-app/README.md`

### 3.2 SmartCity-Platform

Trọng tâm:

- Kiến trúc **pull-based** từ edge (RabbitMQ) vào core backend.
- Phân loại dữ liệu cảm biến bằng ML (IsolationForest) thành HOT/WARM/COLD.
- Lưu trữ phân tầng:
  - HOT -> Redis (real-time, TTL)
  - WARM/COLD -> MongoDB (phân tích lịch sử)

Thành phần chính:

- Backend Spring Boot.
- ML service FastAPI.
- Frontend Nuxt 3.
- Data simulator Python để test tải lớn.

Tài liệu chi tiết:

- `SmartCity-Platform/README.md`
- `SmartCity-Platform/README_EN.md`
- `SmartCity-Platform/ml-service/README.md`
- `SmartCity-Platform/python-data-simulator/README.md`

## 4. Cách chạy nhanh

### 4.1 Chạy HQC_System

```powershell
cd HQC_System
# đọc hướng dẫn chi tiết trước khi chạy
Get-Content README.md
```

Gợi ý: dùng `docker-compose.yml` hoặc setup từng module (`backend`, `web-dashboard`, `web-app`) theo README con.

### 4.2 Chạy SmartCity-Platform

```powershell
cd SmartCity-Platform
docker-compose up -d --build
```

Sau đó chạy simulator (nếu cần test tải):

```powershell
cd python-data-simulator
pip install -r requirements.txt
python main.py
```

## 5. Yêu cầu môi trường đề xuất

- Docker Desktop
- Git
- Node.js 20+
- Python 3.10+ / 3.11+
- Java 17+ (cho các module Spring Boot)

Lưu ý: Mỗi dự án có danh sách phiên bản cụ thể riêng trong README nội bộ.

## 6. Ghi chú giấy phép

- `HQC_System`: GPL-3.0 (xem `HQC_System/LICENSE`)
- `SmartCity-Platform`: Apache-2.0 (xem `SmartCity-Platform/LICENSE`)

Khi tái sử dụng mã nguồn, cần tuân thủ đúng license của từng thư mục dự án.

## 7. Liên hệ & tài liệu

- HQC System docs: `HQC_System/docs/`
- SmartCity-Platform docs: `SmartCity-Platform/docs/`
- SmartCity-Platform online docs: https://Haui-HIT-H2K.github.io/SmartCity-Platform/
