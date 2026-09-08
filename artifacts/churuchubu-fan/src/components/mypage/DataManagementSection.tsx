import { useRef } from 'react';
import { Archive, RefreshCcw, RotateCcw } from 'lucide-react';
import Card from '@/components/common/Card';
import { useMyData } from '@/contexts/MyDataContext';

export default function DataManagementSection() {
  const ctx = useMyData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!ctx) return null;
  const { backupData, restoreData, resetData } = ctx;

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      '現在のデータを上書きします。よろしいですか？',
    );
    if (!confirmed) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const ok = restoreData(json);
      if (ok) {
        window.alert('データを復元しました。');
      } else {
        window.alert(
          'データの復元に失敗しました。\n正しいバックアップファイルか確認してください。',
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      '保存されているすべてのデータを削除します。\nこの操作は元に戻せません。よろしいですか？',
    );
    if (confirmed) {
      resetData();
      window.alert('データをリセットしました。');
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Archive size={14} className="text-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          データ管理
        </h2>
      </div>

      <Card className="overflow-hidden">
        {/* バックアップ */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Archive size={15} className="text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                データをバックアップ
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                現在のデータをJSONファイルとして端末へ保存します
              </p>
              <button
                type="button"
                onClick={backupData}
                className="mt-2.5 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:opacity-70"
              >
                ダウンロード
              </button>
            </div>
          </div>
        </div>

        {/* 復元 */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <RotateCcw size={15} className="text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                データを復元
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                バックアップJSONファイルを選択して復元します
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:opacity-70"
              >
                ファイルを選択
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleRestore}
              />
            </div>
          </div>
        </div>

        {/* リセット */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50">
              <RefreshCcw size={15} className="text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                データをリセット
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                すべてのデータを削除します。この操作は元に戻せません
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100 active:opacity-70"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 注意事項 */}
      <div className="mt-4 rounded-md border border-gray-100 bg-gray-50 px-4 py-4">
        <p className="mb-2 text-xs font-semibold text-gray-600">
          ご利用上の注意
        </p>
        <ul className="space-y-1.5">
          {[
            'データはこの端末・このブラウザ内に保存されます。',
            'ブラウザのデータ削除・キャッシュ削除を行うと記録が消える場合があります。',
            '別の端末・別のブラウザへは自動同期されません。',
            '「データをバックアップ」を利用するとJSONファイルとして端末へ保存できます。',
            'バックアップしたJSONファイルは「ファイル」アプリやiCloud Driveなど、安全な場所へ保存してください。',
            '機種変更時は「データを復元」からバックアップファイルを読み込むことで、記録を引き継げます。',
          ].map((note, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed">
              <span className="mt-0.5 shrink-0 text-gray-400">·</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
