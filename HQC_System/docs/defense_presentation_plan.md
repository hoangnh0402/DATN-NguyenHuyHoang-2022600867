# Kế hoạch Báo cáo Đồ án Tốt nghiệp (Ngành Kỹ thuật Phần mềm)
**Dự án:** HQC System - Nền tảng Thành phố Thông minh với Linked Open Data

> [!TIP]
> Đối với hội đồng ngành **Kỹ thuật Phần mềm (Software Engineering)**, các thầy cô thường đặc biệt quan tâm đến: Kiến trúc hệ thống, quy mô dữ liệu, thuật toán (nếu có), áp dụng Design Patterns, luồng dữ liệu (Data flow) và cách bạn giải quyết các bài toán khó về mặt kỹ thuật (chứ không chỉ là tính năng của ứng dụng).

Dưới đây là một cấu trúc bài báo cáo chuẩn (dự kiến 15-20 phút trình bày) được thiết kế tối ưu nhất để "ghi điểm" với hội đồng:

---

## Phần 1: Đặt vấn đề và Tính cấp thiết (2 phút)
Đừng nói quá dài về tính năng, hãy đi thẳng vào bài toán dữ liệu và hệ thống.
* **Vấn đề thực tế:** Dữ liệu đô thị (không khí, thời tiết, giao thông, hạ tầng) hiện nay đang bị phân mảnh (silos), thiếu chuẩn hóa và không liên thông được với nhau.
* **Vấn đề kỹ thuật:** Làm thế nào để xây dựng một hệ thống đủ khả năng tích hợp, lưu trữ, và truy vấn khối lượng lớn dữ liệu không gian (spatial data) từ nhiều nguồn thời gian thực (real-time)?
* **Mục tiêu đồ án:** Xây dựng một nền tảng sử dụng công nghệ **Linked Open Data (LOD)** và chuẩn quốc tế **NGSI-LD** để giải quyết bài toán tích hợp dữ liệu đô thị.

## Phần 2: Giải pháp Kỹ thuật & Kiến trúc Hệ thống (5 - 6 phút)
> [!IMPORTANT]
> Đây là phần quan trọng nhất để chứng minh năng lực kỹ thuật của một Kỹ sư Phần mềm. Hãy nhấn mạnh vào các Diagram.

* **Tổng quan Kiến trúc (System Architecture):**
  * Trình bày sơ đồ hệ thống tổng thể.
  * Nhấn mạnh việc chia tách Frontend (Next.js & React Native Expo) và Backend (FastAPI).
* **Kiến trúc Dữ liệu 3 lớp (LOD Architecture):**
  * Giải thích tại sao phải dùng **PostgreSQL + PostGIS** cho dữ liệu không gian.
  * Tại sao dùng **MongoDB** cho dữ liệu phi cấu trúc (NoSQL).
  * Tại sao dùng **GraphDB (Apache Jena)** cho dữ liệu liên kết (Knowledge Graph/RDF).
  * **Redis** dùng để làm gì? (Caching dữ liệu thời gian thực như AQI, Thời tiết).
* **Chuẩn hóa Dữ liệu:** Đề cập ngắn gọn đến việc áp dụng chuẩn Ontology, SOSA/SSN cho các cảm biến.

## Phần 3: Phân tích và Thiết kế (3 phút)
* **Xử lý Dữ liệu Lớn:** Chia sẻ về cách bạn import và quản lý **hơn 487,000 thực thể** từ OpenStreetMap (OSM) vào CSDL. Cách tối ưu hóa truy vấn bằng Index không gian (Spatial Indexing) trong PostGIS.
* **Thiết kế API:** Áp dụng chuẩn NGSI-LD cho các RESTful API.
* **Luồng xử lý Cảnh báo Thông minh (Smart Alerts):** Sơ đồ luồng (Flowchart) từ lúc Cảm biến ghi nhận dữ liệu -> Đưa qua AI (Gemini) phân tích -> Đẩy qua WebSocket/Notifications xuống Mobile App và Dashboard.

## Phần 4: Demo Sản phẩm (4 - 5 phút)
*Nên quay sẵn video Demo và chèn vào Slide để tránh rủi ro "chết lâm sàng" lúc demo trực tiếp do mạng yếu.*
* **Web Dashboard (Admin):** Mở bản đồ hiển thị dữ liệu địa lý (Heatmaps, POIs), cho thấy khả năng render khối lượng dữ liệu lớn trên trình duyệt mượt mà.
* **Chức năng cốt lõi:** Luồng xử lý một "Báo cáo sự cố" (Civic Issue) từ người dân (trên Mobile App) đẩy lên Server, Admin tiếp nhận, hệ thống tự động gán cảnh báo.
* **Tích hợp AI:** Phô diễn chức năng AI tự động phân tích dữ liệu cảm biến và tạo cảnh báo thông minh.

## Phần 5: Đánh giá và Kiểm thử (Testing & Evaluation) (2 phút)
Hội đồng phần mềm rất thích việc sinh viên có đánh giá định lượng minh bạch:
* **Kiểm thử hiệu năng (Performance Testing):** Nếu có dùng Postman/JMeter bắn tải (load test), hãy đưa biểu đồ Response Time của API lên.
* **Đóng góp mã nguồn mở:** Khoe điểm sáng của đồ án là bạn đã đóng gói thành các **NPM Packages** (ví dụ: `hqc-system-utils`, `hqc-system-ngsi-ld`) và xuất bản công khai. Điều này cho thấy tính chuyên nghiệp và khả năng tái sử dụng code (Reusability).

## Phần 6: Kết luận & Hướng phát triển (1 phút)
* Khẳng định lại hệ thống đã chạy được, giải quyết được bài toán đặt ra.
* **Hạn chế:** (Nêu 1-2 hạn chế mang tính học thuật, ví dụ: "Chưa áp dụng queue như Kafka hay RabbitMQ để xử lý luồng dữ liệu stream lớn hơn").
* **Hướng phát triển:** Tích hợp Machine Learning trực tiếp để dự đoán tắc đường/ô nhiễm.

---

### 💡 Các câu hỏi hội đồng Kỹ thuật Phần mềm thường hay "xoáy":
1. **Tại sao lại dùng nhiều Database (Postgres, Mongo, GraphDB) cùng lúc? Làm sao đảm bảo tính nhất quán (Consistency) của dữ liệu giữa các DB này?**
   * *Gợi ý trả lời:* Dùng mô hình Polyglot Persistence. Giải thích cơ chế đồng bộ hoặc phân tách domain rõ ràng (cái nào lưu tọa độ tĩnh, cái nào lưu log thay đổi nhanh).
2. **Nếu có 1 triệu người cùng truy cập vào Mobile App gửi báo cáo sự cố thì hệ thống xử lý thế nào?**
   * *Gợi ý trả lời:* Nhấn mạnh vào Redis Cache, khả năng Scale của Docker/Kubernetes, API Rate Limiting hoặc ý tưởng thêm Message Queue.
3. **Data model (NGSI-LD) khác gì với REST JSON bình thường?**
   * *Gợi ý trả lời:* Nó hỗ trợ semantic web (Ngữ nghĩa), Linked Data (chứa `@context`, liên kết được với các domain khác nhau).
4. **Khó khăn lớn nhất về mặt kỹ thuật khi làm dự án này là gì?**
   * *Gợi ý trả lời:* Có thể là việc import lượng dữ liệu khổng lồ từ OSM, hoặc khó khăn trong việc vẽ các ontology mapping.
