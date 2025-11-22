import os
import re
from pathlib import Path
import pandas as pd

# --- INPUTS ---
ROOT = Path(r"C:\Users\ICL  ZAMBIA\Desktop\okasina-fashion-store-vite")
OCR_XLSX = ROOT / r"public\ai-collection\ocr_results.xlsx"
TEMPLATE_CSV = ROOT / r"public\product-import-template.csv"

# --- OUTPUT ---
OUT_MERGED_CSV = ROOT / r"public\product-import-merged.csv"
OUT_MERGED_XLSX = ROOT / r"public\product-import-merged.xlsx"

# --- Helpers ---
def normalize_filename(s: str):
    if not isinstance(s, str) or not s.strip():
        return "", ""
    base = os.path.basename(s.strip())
    base = base.replace("\\", "/").split("/")[-1]
    base = base.strip().lower()
    stem, ext = os.path.splitext(base)
    return stem, base

def trim_variant(stem: str) -> str:
    if not isinstance(stem, str):
        return ""
    s = re.sub(r"-(\d{1,2})$", "", stem)       # drop -01, -1
    s = re.sub(r"\s*\(\d+\)$", "", s)          # drop (1)
    return s

def parse_price(text: str):
    if not isinstance(text, str):
        return None
    t = text.lower().replace(",", "")
    m = re.search(r"(?:rs|mur)\s*[:\-]?\s*(\d{3,6})", t)
    if m:
        return int(m.group(1))
    m2 = re.search(r"\b(\d{3,6})\b", t)
    if m2:
        return int(m2.group(1))
    return None

def parse_size(text: str):
    if not isinstance(text, str):
        return None
    t = text.lower()
    if "free size" in t:
        return "Free Size"
    tokens = re.findall(r"\b(?:xxxl|xxl|xl|l|m|s|xs|3xl|4xl|5xl|6xl)\b", t)
    tokens = [tok.upper() for tok in tokens]
    if tokens:
        return ", ".join(dict.fromkeys(tokens))  # dedupe, preserve order
    return None

# --- Main ---
def main():
    # Load template (primary)
    tpl_df = pd.read_csv(TEMPLATE_CSV, encoding="utf-8-sig")
    print(f"📂 Loaded template with {len(tpl_df)} rows")

    # Load OCR
    ocr_df = pd.read_excel(OCR_XLSX)
    if "FileName" not in ocr_df.columns:
        raise ValueError("OCR sheet must contain a 'FileName' column.")

    ocr_df["__stem"], _ = zip(*ocr_df["FileName"].map(normalize_filename))
    ocr_df["__stem_trim"] = ocr_df["__stem"].map(trim_variant)

    # Parse text
    ocr_df["ParsedPrice"] = ocr_df["ExtractedText"].map(parse_price)
    ocr_df["ParsedSize"]  = ocr_df["ExtractedText"].map(parse_size)

    # --- Add missing columns to template
    for col in ["ExtractedText", "ParsedPrice", "ParsedSize"]:
        if col not in tpl_df.columns:
            tpl_df[col] = None

    # Try to match by SKU or by filename
    sku_cols = [c for c in tpl_df.columns if c.lower() in ("sku","product_code","code","id")]
    if sku_cols:
        sku_col = sku_cols[0]
        tpl_df["__stem"] = tpl_df[sku_col].astype(str).str.lower()
    else:
        filename_cols = [c for c in tpl_df.columns if "file" in c.lower() or "image" in c.lower()]
        if not filename_cols:
            raise ValueError("No SKU or filename column found in template.")
        fn_col = filename_cols[0]
        tpl_df["__stem"], _ = zip(*tpl_df[fn_col].map(normalize_filename))

    tpl_df["__stem_trim"] = tpl_df["__stem"].map(trim_variant)

    # Merge OCR data into template
    merged = tpl_df.copy()
    for idx, row in merged.iterrows():
        key = str(row["__stem_trim"])
        match = ocr_df[ocr_df["__stem_trim"] == key]
        if not match.empty:
            merged.at[idx, "ExtractedText"] = match["ExtractedText"].iloc[0]
            merged.at[idx, "ParsedPrice"]   = match["ParsedPrice"].iloc[0]
            merged.at[idx, "ParsedSize"]    = match["ParsedSize"].iloc[0]

    # Drop helper columns
    merged = merged.drop(columns=["__stem","__stem_trim"], errors="ignore")

    # Save
    merged.to_csv(OUT_MERGED_CSV, index=False, encoding="utf-8-sig")
    merged.to_excel(OUT_MERGED_XLSX, index=False)
    print(f"✅ Merged saved → {OUT_MERGED_CSV}")
    print(f"✅ Merged saved → {OUT_MERGED_XLSX}")

if __name__ == "__main__":
    main()
