import os
import requests

# 保存先フォルダを指定（必要に応じて変更）
save_dir = "kurohon_images"
os.makedirs(save_dir, exist_ok=True)

# 画像URLリスト（先ほどの一覧を貼り付け）
urls = [
    "https://images.amazon.com/images/P/4845618710.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845628244.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845619458.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845629828.09_SL110_.jpg",
    "https://images.amazon.com/images/P/484561944X.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845629968.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845638037.09_SL110_.jpg",
    "https://images.amazon.com/images/P/484563256X.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845632578.09_SL110_.jpg",
    "https://images.amazon.com/images/P/4845623994.09_SL110_.jpg",
    "https://images.amazon.com/images/P/499019411X.09_SL110_.jpg",
    "https://images.amazon.com/images/P/0634060384.09_SL110_.jpg",
    "https://images.amazon.com/images/P/1423424522.09_SL110_.jpg",
    "https://images.amazon.com/images/P/0634060848.09_SL110_.jpg",
    "https://images.amazon.com/images/P/1480384534.09_SL110_.jpg",
    "https://images.amazon.com/images/P/1495027929.09_SL110_.jpg",
    "https://images.amazon.com/images/P/B0F63YDNCN.09_SL110_.jpg"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/114.0.0.0 Safari/537.36"
}

# ダウンロード処理
for url in urls:
    try:
        filename = url.split("/")[-1]
        filepath = os.path.join(save_dir, filename)
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"✅ {filename} downloaded.")
        else:
            print(f"⚠️ Failed: {filename} ({response.status_code})")
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")
