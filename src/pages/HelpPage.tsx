const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: '基本概念',
    items: [
      '所有資料只會儲存在您目前使用的瀏覽器 IndexedDB 內，不會上傳到任何伺服器。',
      '即使離線，已儲存的樓盤資料仍可查看、編輯、比較及匯出。',
      '建議定期使用「Backup / 匯入匯出」頁面匯出 JSON 備份，以防瀏覽器資料被清除。',
    ],
  },
  {
    title: '新增 / 編輯樓盤',
    items: [
      '在「新增樓盤」頁面填寫基本資料、戶型資料、Clubhouse／公共空間資料及 CPS 車位資料。',
      '中文或英文樓盤名稱至少填寫一項。',
      '發展商或地區選擇「其他」時，必須填寫對應的名稱欄位。',
      '單位數量（Inventory Count）只需輸入數量，百分比會在比較表及匯出時自動計算，毋須手動輸入。',
      'Units per Resident Space（每個車位的住宅單位數）會根據 Total No. of Residential Units 及 Resident Parking Spaces 自動計算，無法手動輸入。',
    ],
  },
  {
    title: '搜尋與篩選',
    items: [
      '可使用關鍵字搜尋樓盤名稱、發展商、地區、備註等欄位。',
      '可使用發展商篩選、地區篩選及細分地區搜尋，並可同時使用多個篩選條件。',
    ],
  },
  {
    title: '勾選與比較',
    items: [
      '在樓盤資料庫勾選最多 10 個樓盤，按「產生比較表」即可查看 Saleable Area、Inventory 及 CPS 三個比較表。',
      '可在比較表頁面拖曳樓盤卡片調整比較順序，三個表格的順序會同步更新。',
      '可使用「顯示設定」調整要顯示或隱藏的欄位，例如 Clubhouse Area、備註、百分比等。',
    ],
  },
  {
    title: '匯出資料',
    items: [
      '比較表頁面可匯出目前比較表為 Excel（包含 5 個工作表）或 CSV。',
      'Backup 頁面可匯出所有資料為 JSON Backup、CSV 或 Excel。',
      '所有匯出的自由文字欄位皆已加入 CSV Injection 防護，避免被 Excel 誤判為公式。',
    ],
  },
  {
    title: '匯入資料',
    items: [
      '支援匯入 JSON Backup 及 CSV 檔案，匯入前會顯示預覽及驗證結果。',
      'Merge 模式會保留現有資料並加入新資料；Replace 模式會先清除現有資料。',
      '若匯入的檔案包含舊版的 inventoryPercentage 或 unitsPerResidentSpace 欄位，系統會自動忽略並於匯入後重新計算。',
    ],
  },
  {
    title: 'PWA 離線使用',
    items: [
      '此應用程式可安裝為 PWA（如使用 Chrome／Edge，網址列會出現安裝圖示）。',
      '安裝後即使離線亦可開啟應用程式及查看、編輯已儲存的樓盤資料。',
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">使用說明</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hong Kong Property Table Builder 完整操作指南
        </p>
      </div>
      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {section.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
