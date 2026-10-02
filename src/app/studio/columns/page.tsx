import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { ColumnForm } from "@/components/column-form";
import { getColumns, getCurrentUser } from "@/lib/data";

export const metadata = { title: "专栏管理" };
export default async function ManageColumnsPage() {
  const { user, profile } = await getCurrentUser();
  if (!user || profile?.role !== "admin")
    redirect("/login?next=/studio/columns");
  const columns = await getColumns();
  return (
    <main className="studio-page page-shell" id="main-content" tabIndex={-1}>
      <header className="editor-header">
        <Link className="back-link" href="/studio">
          <ArrowLeft size={16} /> 返回写作台
        </Link>
        <p className="eyebrow">Your collections</p>
        <h1>专栏管理</h1>
        <p className="muted">
          调整名称、介绍、顺序与阅读风格。文章会自动延续所属专栏的风格。
        </p>
      </header>
      <div className="column-management">
        {columns.map((column) => (
          <details className="column-settings" key={column.slug}>
            <summary>
              <span className={`column-settings-mark theme-${column.theme}`} />
              <span>
                <strong>{column.name}</strong>
                <small>/columns/{column.slug}</small>
              </span>
              <span className="column-settings-order">
                顺序 {column.sort_order ?? 100}
              </span>
            </summary>
            <div>
              <Link className="read-link" href={`/columns/${column.slug}`}>
                查看专栏 <ArrowUpRight size={15} />
              </Link>
              <ColumnForm column={column} />
            </div>
          </details>
        ))}
        <details className="column-settings new-column">
          <summary>
            <Plus size={22} />
            <strong>创建新专栏</strong>
          </summary>
          <div>
            <ColumnForm />
          </div>
        </details>
      </div>
    </main>
  );
}
