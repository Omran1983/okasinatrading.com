import os
import pytesseract
from PIL import Image
import pandas as pd

# Path to your images
folder = r"C:\Users\ICL  ZAMBIA\Desktop\okasina-fashion-store-vite\public\ai-collection"

# Path to Tesseract OCR executable (install from https://github.com/UB-Mannheim/tesseract/wiki)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

data = []

# Loop through all JPG/JPEG files
for file in sorted(os.listdir(folder)):
    if file.lower().endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join(folder, file)
        try:
            img = Image.open(path)
            text = pytesseract.image_to_string(img)
            data.append({"FileName": file, "ExtractedText": text.strip()})
            print(f"✅ {file} processed")
        except Exception as e:
            print(f"⚠️ Could not process {file}: {e}")

# Save to Excel
df = pd.DataFrame(data)
out_file = os.path.join(folder, "ocr_results.xlsx")
df.to_excel(out_file, index=False)

print(f"\n📂 OCR completed! Results saved to: {out_file}")
