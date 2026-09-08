// ============================================================
// ルートスラグ
// ページ追加時はここに追記してください。
// ============================================================

export type RouteSlug =
  | '/'
  | '/live'
  | '/members'
  | '/benefits'
  | '/regulations'
  | '/about'
  | '/news';

// ============================================================
// エンティティ型（各ファイルで定義・管理）
// ============================================================
// Member        → src/data/members.ts
// Benefit 系    → src/data/benefits.ts
// Regulation 系 → src/data/regulations.ts
// NavItem       → src/data/navigation.ts
// Live          → src/services/googleSheets.ts
// News          → src/services/googleSheets.ts

// ============================================================
// 将来実装予定の型
// ============================================================

