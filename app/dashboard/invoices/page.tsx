import { fetchInvoicesPages } from '@/app/lib/data';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import Pagination from '@/app/ui/invoices/pagination';
import Table from '@/app/ui/invoices/table';
import Search from '@/app/ui/search';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`font-sans text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense>
          <Search placeholder="Search invoices..." />
        </Suspense>
        <CreateInvoice />
      </div>
      {/* 将所有依赖异步数据的组件都放在 Suspense 内部 */}
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <InvoicesTableContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// 创建一个异步组件来处理所有数据获取
async function InvoicesTableContent({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <>
      <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}