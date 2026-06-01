/**
 * 📜 Script · Tiếng Việt — 🌏 Địa lý
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "callback_url": "",
  "script_text": "Sông Mê Kông dài bốn nghìn ba trăm năm mươi cây số, chảy qua sáu quốc gia: Trung Quốc, Myanmar, Lào, Thái Lan, Campuchia, Việt Nam. Từ băng tan trên cao nguyên Tây Tạng đến đồng bằng sông Cửu Long, lưu vực nuôi sống sáu mươi triệu người. Trung Quốc xây mười một đập thủy điện trên thượng nguồn từ năm hai nghìn không trăm, giữ lại bốn mươi tỷ mét khối nước mỗi năm. Lào xây thêm bảy đập. Hệ quả là gì? Đồng bằng sông Cửu Long mất một phần ba lượng phù sa từ năm hai nghìn không trăm chín, dòng chảy mùa khô giảm hai mươi phần trăm. Tranh chấp nước Mê Kông sẽ là xung đột địa chính trị lớn nhất Đông Nam Á trong hai mươi năm tới."
});
console.log(resp);
